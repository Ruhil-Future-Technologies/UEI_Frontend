import React, { useContext, useEffect, useState } from "react";
import "./MainContent.css";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import { PieChart } from "@mui/x-charts/PieChart";

// import { Dataset } from '@mui/icons-material';
// import Box from '@mui/material/Box';
import useApi from "../../hooks/useAPI";
// import Button from '@mui/material/Button';

import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  QUERY_KEYS,
  QUERY_KEYS_ADMIN_BASIC_INFO,
  QUERY_KEYS_STUDENT,
} from "../../utils/const";
import { toast } from "react-toastify";
import { hasSubMenu } from "../../utils/helpers";
import FullScreenLoader from "../../Pages/Loader/FullScreenLoader";
import { tuple } from "yup";
import NameContext from "../../Pages/Context/NameContext";
import Teacher from "../../Pages/Uploadpdf/Uploadpdf";
import { ProfileDialog } from "../Dailog/ProfileComplation";

function MainContent() {
  const context = useContext(NameContext);
  const navigate = useNavigate();
  const { setProPercentage }: any = context;
  const [userName, setUserName] = useState("");
  let StudentId = localStorage.getItem("_id");
  let menuList = localStorage.getItem("menulist1");
  let menudata: any = [];
  if (menuList !== null) {
    menudata = JSON.parse(menuList);
  }
  const profileURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
  const profileURLadmin = QUERY_KEYS_ADMIN_BASIC_INFO.ADMIN_GET_PROFILE;
  const [profileDatas, setProfileDatas] = useState<any>({});
  const [basicinfoPercentage, setbasicinfoPercentage] = useState<number>(0);
  const [addressPercentage, setaddressPercentage] = useState<number>(0);
  const [languagePercentage, setlanguagePercentage] = useState<number>(0);
  const [academichistoryPercentage, setacademichistoryPercentage] =
    useState<number>(0);
  const [contactPercentage, setcontactPercentage] = useState<number>(0);
  const [hobbyPercentage, sethobbyPercentage] = useState<number>(0);
  const [subjectPercentage, setsubjectPercentage] = useState<number>(0);
  const [overallProfilePercentage, setoverallProfilePercentage] =
    useState<number>(0);
  const [desctiptionPercentage, setdesctiptionPercentage] = useState<number>(0);
  const [profileImage, setprofileImage] = useState<any>();
  const [dataCompleted, setDataCompleted] = useState(false);

  const usertype: any = localStorage.getItem("user_type");
  // const userdata = JSON.parse(localStorage?.getItem("userdata") || "/{/}/");
  const userdata = JSON.parse(localStorage?.getItem("userdata") || "{}");

  const chatlisturl = QUERY_KEYS.CHAT_LIST;
  useEffect(() => {
    if (usertype === "admin") {
      setUserName("admin");
      setDataCompleted(false);
    } else if (usertype === "student") {
      setUserName("student");
      // setUserName('teacher')
    } else if (usertype === "teacher") {
      setUserName("teacher");
    } else {
      setUserName("admin");
    }
  }, [usertype]);

  const profileData: any = sessionStorage.getItem("profileData");

  let basicinfo: any = {};
  if (profileData !== null) {
    basicinfo = JSON.parse(profileData);
  }

  const { getData, loading } = useApi();
  const [stats, setStats] = useState({
    institutionCount: 0,
    studentCount: 0,
    subjectCount: 0,
    entityCount: 0,
    departmentCount: 0,
    courseCount: 0,
  });
  const [stats1, setStats1] = useState<any>({
    Student_Profile: 0,
    Student_null: 0,
  });
  const [student, setStudent] = useState({
    chatHistory: 0,
    chatCount: 0,
  });

  const barData = {
    labels: [
      "Entities",
      "Institute",
      "Student",
      "Course",
      "Subject",
      "Department",
    ],
    datasets: [
      {
        label: "Dataset 1",
        backgroundColor: "#3498DB",
        borderColor: "#3498DB",
        borderWidth: 1,
        data: [
          stats.entityCount,
          stats.institutionCount,
          stats.studentCount,
          stats.courseCount,
          stats.subjectCount,
          stats.departmentCount,
        ],
      },
    ],
  };
  const lineData = {
    labels: [
      "Entities",
      "Institute",
      "Student",
      "Course",
      "Subject",
      "Department",
    ],
    datasets: [
      {
        label: "Dataset 2",
        backgroundColor: "#3498DB",
        borderColor: "#3498DB",
        data: [
          stats.entityCount,
          stats.institutionCount,
          stats.studentCount,
          stats.courseCount,
          stats.subjectCount,
          stats.departmentCount,
        ],
      },
    ],
  };

  const countKeysWithValue = (obj: any): number => {
    return Object.keys(obj).filter(
      (key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== ""
    ).length;
  };

  const callAPIStudent = async () => {
    if (usertype === "student") {
      getData(`${profileURL}/${StudentId}`)
        .then((data: any) => {
          if (data.data) {
            setProfileDatas(data?.data);
            //   let basic_info = data.data.basic_info;
            let basic_info = {
              // aim: data?.data?.basic_info?.aim,
              dob: data?.data?.basic_info?.dob,
              father_name: data?.data?.basic_info?.father_name,
              first_name: data?.data?.basic_info?.first_name,
              gender: data?.data?.basic_info?.gender,
              id: data?.data?.basic_info?.id,
              // is_active: data?.data?.basic_info?.is_active,
              // is_kyc_verified: data?.data?.basic_info?.is_kyc_verified,
              // last_modified_datetime: data?.data.basic_info?.last_modified_datetime,
              last_name: data?.data?.basic_info?.last_name,
              mother_name: data?.data?.basic_info?.mother_name,
              // student_registration_no: data?.data?.basic_info?.student_registration_no
            };
            let address = {
              address1: data?.data?.address?.address1,
              country: data?.data?.address?.country,
              state: data?.data?.address?.state,
              city: data?.data?.address?.city,
              district: data?.data?.address?.district,
              pincode: data?.data?.address?.pincode,
            };
            let language = {
              language_id: data?.data?.language_known?.language_id,
              proficiency: data?.data?.language_known?.proficiency,
            };
            let academic_history = {
              institution_name: data?.data?.academic_history?.institution_name,
              course_name: data?.data?.academic_history?.course_name,
              starting_date: data?.data?.academic_history?.starting_date,
              ending_date: data?.data?.academic_history?.ending_date,
              learning_style: data?.data?.academic_history?.learning_style,
              class_name: data?.data?.academic_history?.class_name,
            };
            //   let contact = data.data.contact;
            let contact = {
              // email_id: data?.data?.contact?.email_id,
              id: data?.data?.contact?.id,
              // is_active: data?.data?.contact?.is_active,
              mobile_isd_call: data?.data?.contact?.mobile_isd_call,
              mobile_no_call: data?.data?.contact?.mobile_no_call,
              // mobile_no_watsapp: data?.data?.contact?.mobile_no_watsapp,
            };
            let subject_preference = {
              course_name: data?.data?.subject_preference?.course_name,
              subject_name: data?.data?.subject_preference?.subject_name,
              preference: data?.data?.subject_preference?.preference,
              score_in_percentage:
                data?.data?.subject_preference?.score_in_percentage,
            };
            //   let hobby = data.data.hobby;

            let totalPercentage = 0;
            let sectionCount = 0;

            if (basic_info && Object.keys(basic_info).length > 0) {
              if (data.data.pic_path !== "") {
                getData(`${"upload_file/get_image/" + data.data.pic_path}`)
                  .then((imgdata: any) => {
                    setprofileImage(imgdata.data);
                  })
                  .catch((e) => {
                    // Handle error
                  });
              }
              let totalcount = Object.keys(basic_info).length;
              let filledCount = countKeysWithValue(basic_info);
              let percentage = (filledCount / totalcount) * 100;
              setbasicinfoPercentage(percentage);
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }

            if (address && Object.keys(address).length > 0) {
              let totalcount = Object.keys(address).length;
              let filledCount = countKeysWithValue(address);
              let percentage = (filledCount / totalcount) * 100;
              setaddressPercentage(percentage);
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }

            if (language && Object.keys(language).length > 0) {
              let totalhobbycount = 0;
              let filledhobbyCount = 0;
              // if (hobby && Object.keys(hobby).length > 0) {
              //   totalhobbycount = Object.keys(hobby).length;
              //   filledhobbyCount = countKeysWithValue(hobby);
              // }
              let totalcount = Object.keys(language).length + totalhobbycount;
              let filledCount = countKeysWithValue(language) + filledhobbyCount;
              let percentage = (filledCount / totalcount) * 100;
              setlanguagePercentage(percentage);
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }

            // if (academic_history && Object.keys(academic_history).length > 0) {
            //   let totalcount = Object.keys(academic_history).length;
            //   let filledCount = countKeysWithValue(academic_history);
            //   let percentage = (filledCount / totalcount) * 100;
            //   setacademichistoryPercentage(percentage);
            //   totalPercentage += percentage;
            //   sectionCount++;
            // } else {
            //   sectionCount++;
            // }

            if (contact && Object.keys(contact).length > 0) {
              let totalcount = Object.keys(contact).length;
              let filledCount = countKeysWithValue(contact);
              let percentage = (filledCount / totalcount) * 100;
              setcontactPercentage(percentage);
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }

            // if (
            //   subject_preference &&
            //   Object.keys(subject_preference)?.length > 0
            // ) {
            //   let totalcount = Object.keys(subject_preference)?.length;
            //   let filledCount = countKeysWithValue(subject_preference);
            //   let percentage = (filledCount / totalcount) * 100;
            //   setsubjectPercentage(percentage);
            //   totalPercentage += percentage;
            //   sectionCount++;
            // } else {
            //   sectionCount++;
            // }

            if (sectionCount > 0) {
              let overallPercentage = totalPercentage / sectionCount;
              // setoverallProfilePercentage(overallPercentage); // Set the overall percentage
              overallPercentage = Math.round(overallPercentage);
              const nandata = 100 - overallPercentage;

              // console.log("overallPercentage sss", nandata,overallPercentage);
              localStorage.setItem(
                "Profile_completion",
                JSON.stringify(overallPercentage)
              );
              console.log("OverallPercentage", overallPercentage);

              if (overallPercentage !== 100) {
                setDataCompleted(true);
              }
              setStats1({
                Student_Profile: overallPercentage,
                Student_null: nandata,
              });
              setProPercentage(overallPercentage);
            }
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    }
  };

  const fetchStudentData = async () => {
    if (usertype === "student") {
      try {
        const [chatHistory, chatCount] = await Promise.all([
          getData(`${chatlisturl}/${userdata?.id}`),
          getData("/chat/api/chat-count/" + StudentId),
        ]);
        const chatstarred =
          chatHistory?.data?.filter((chat: any) => chat?.flagged) || [];
        setStudent({
          // chatHistory: chatHistory?.data?.length || 0,
          chatHistory: chatstarred?.length || 0,
          chatCount: chatCount?.chat_count || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const callAPIAdmin = async () => {
    if (usertype === "admin") {
      getData(`${profileURLadmin}/${StudentId}`)
        .then((data: any) => {
          if (data?.data) {
            // setProfileData(data?.data)
            // let basic_info = data?.data?.basic_info
            let basic_info = {
              dob: data?.data?.basic_info?.dob,
              father_name: data?.data?.basic_info?.father_name,
              first_name: data?.data?.basic_info?.first_name,
              gender: data?.data?.basic_info?.gender,
              id: data?.data?.basic_info?.id,
              last_modified_datetime:
                data?.data.basic_info?.last_modified_datetime,
              last_name: data?.data?.basic_info?.last_name,
              mother_name: data?.data?.basic_info?.mother_name,
              admin_registration_no:
                data?.data?.basic_info?.admin_registration_no,
              department_id: data?.data?.basic_info?.department_id,
              guardian_name: data?.data?.basic_info?.guardian_name,
            };
            // let address = data?.data?.address
            let address = {
              address1: data?.data?.address?.address1,
              country: data?.data?.address?.country,
              state: data?.data?.address?.state,
              city: data?.data?.address?.city,
              district: data?.data?.address?.district,
              pincode: data?.data?.address?.pincode,
            };
            // let language = data?.data?.language_known
            let language = {
              language_id: data?.data?.language_known?.language_id,
              proficiency: data?.data?.language_known?.proficiency,
            };
            let description = data?.data?.admin_description;
            // let contact = data?.data?.contact
            let contact = {
              // email_id: data?.data?.contact?.email_id,
              id: data?.data?.contact?.id,
              // is_active: data?.data?.contact?.is_active,
              mobile_isd_call: data?.data?.contact?.mobile_isd_call,
              mobile_no_call: data?.data?.contact?.mobile_no_call,
              // mobile_no_watsapp: data?.data?.contact?.mobile_no_watsapp,
            };
            // let profession = data?.data?.profession
            let profession = {
              course_id: data?.data?.profession?.course_id,
              subject_id: data?.data?.profession?.subject_id,
              institution_id: data?.data?.profession?.institution_id,
            };
            let hobby = data?.data?.hobby;
            let totalPercentage = 0;
            let sectionCount = 0;
            if (basic_info && Object.keys(basic_info)?.length > 0) {
              if (data?.data?.pic_path !== "") {
                getData(`${"upload_file/get_image/" + data?.data?.pic_path}`)
                  .then((imgdata: any) => {
                    // setprofileImage(imgdata?.data)
                  })
                  .catch((e) => {});
              }

              let totalcount = Object.keys(basic_info)?.length;
              let filledCount = countKeysWithValue(basic_info);
              let percentage = (filledCount / totalcount) * 100;
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }
            if (address && Object.keys(address)?.length > 0) {
              let totalcount = Object.keys(address)?.length;
              let filledCount = countKeysWithValue(address);
              let percentage = (filledCount / totalcount) * 100;
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }
            if (language && Object.keys(language).length > 0) {
              let totalhobbycount = 0;
              let filledhobbyCount = 0;
              if (hobby && Object.keys(hobby).length > 0) {
                totalhobbycount = Object.keys(hobby).length;
                filledhobbyCount = countKeysWithValue(hobby);
              }
              let totalcount = Object.keys(language).length + totalhobbycount;
              let filledCount = countKeysWithValue(language) + filledhobbyCount;
              let percentage = (filledCount / totalcount) * 100;
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }
            if (description && Object.keys(description).length > 0) {
              let totalcount = Object.keys(description).length;
              let filledCount = countKeysWithValue(description);
              let percentage = (filledCount / totalcount) * 100;
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }
            if (contact && Object.keys(contact).length > 0) {
              let totalcount = Object.keys(contact).length;
              let filledCount = countKeysWithValue(contact);
              let percentage = (filledCount / totalcount) * 100;
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }
            if (profession && Object.keys(profession).length > 0) {
              let totalcount = Object.keys(profession).length;
              let filledCount = countKeysWithValue(profession);
              let percentage = (filledCount / totalcount) * 100;
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }
            // console.log("---- ddd eee",sectionCount)
            if (sectionCount > 0) {
              let overallPercentage = totalPercentage / sectionCount;
              // setoverallProfilePercentage(overallPercentage); // Set the overall percentage
              overallPercentage = Math.round(overallPercentage);
              const nandata = 100 - overallPercentage;

              // console.log("overallPercentage sss", nandata,overallPercentage);
              localStorage.setItem(
                "Profile_completion",
                JSON.stringify(overallPercentage)
              );
              setProPercentage(overallPercentage);
              // console.log("---- ddd",overallPercentage)
              // if(overallPercentage !== 100){
              //     setDatacomplated(true)
              // }
            }
          }
        })
        .catch((e) => {
          // toast.error(e?.message, {
          //   hideProgressBar: true,
          //   theme: "colored",
          // });
        });
    }
  };
  const handlecancel = () => {
    setDataCompleted(false);
  };
  const handleOk = (userName: string) => {
    userName === "admin"
      ? navigate("/main/adminprofile")
      : navigate("/main/StudentProfile");
  };

  useEffect(() => {
    if (userName !== "admin") {
      callAPIStudent();
      fetchStudentData();
    }

    callAPIAdmin();

    const fetchData = async () => {
      if (usertype === "admin") {
        try {
          const [
            institutionRes,
            studentRes,
            subjectRes,
            entityRes,
            departmentRes,
            courseRes,
          ] = await Promise.allSettled([
            getData("/institution/list"),
            getData("/student/list"),
            getData("/subject/list"),
            getData("/entity/list"),
            getData("/department/list"),
            getData("/course/list"),
          ]);
          const institutionCount =
            institutionRes?.status === "fulfilled"
              ? institutionRes?.value?.data?.length || 0
              : 0;
          const studentCount =
            studentRes?.status === "fulfilled"
              ? studentRes?.value?.data?.length || 0
              : 0;
          const subjectCount =
            subjectRes?.status === "fulfilled"
              ? subjectRes?.value?.data?.length || 0
              : 0;
          const entityCount =
            entityRes?.status === "fulfilled"
              ? entityRes?.value?.data?.length || 0
              : 0;
          const departmentCount =
            departmentRes?.status === "fulfilled"
              ? departmentRes?.value?.data?.length || 0
              : 0;
          const courseCount =
            courseRes?.status === "fulfilled"
              ? courseRes?.value?.data?.length || 0
              : 0;

          setStats({
            institutionCount,
            studentCount,
            subjectCount,
            entityCount,
            departmentCount,
            courseCount,
          });

          // setStats({
          //     institutionCount: institutionRes?.data?.length || 0,
          //     studentCount: studentRes?.data?.length || 0 ,
          //     subjectCount: subjectRes?.data?.length || 0,
          //     entityCount: entityRes?.data?.length || 0,
          //     departmentCount: departmentRes?.data?.length || 0,
          //     courseCount: courseRes?.data?.length || 0 ,
          // });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    // const fetchstucount = async () => {
    //     getData("hobby/list")
    //     .then((data: any) => {
    //       if (data?.status === 200) {
    //         const filteredData = data?.data?.filter((item:any) => item?.is_active === 1);
    //         // setAllHobbies(filteredData ||[]);
    //         // setAllHobbies(data?.data);
    //       }
    //     })
    //     .catch((e) => {
    //       toast.error(e?.message, {
    //         hideProgressBar: true,
    //         theme: "colored",
    //       });
    //     });
    // }

    fetchData();

    // fetchstucount();
  }, []);

  const pieData = [
    { id: 0, value: stats.entityCount, label: "Entity" },
    { id: 1, value: stats.institutionCount, label: "Institute" },
    { id: 2, value: stats.studentCount, label: "Student" },
    { id: 3, value: stats.courseCount, label: "Course" },
    { id: 4, value: stats.subjectCount, label: "Subject" },
    { id: 5, value: stats.departmentCount, label: "Department" },
  ];

  const pieData1 = [
    { id: 0, value: stats1?.Student_Profile, label: `Profile completed` },
    { id: 1, value: stats1?.Student_null, label: `Pending Profile` },
    //`${stats1.Student_Profile}% Profile`
  ];

  const EntityExists = hasSubMenu(menudata, "Entity");
  const InstitutionsExists = hasSubMenu(menudata, "Institute");
  const StudentsExists = hasSubMenu(menudata, "Student");
  const CoursesExists = hasSubMenu(menudata, "Course");
  const SubjectsExists = hasSubMenu(menudata, "Subject");
  const DepartmentExists = hasSubMenu(menudata, "Department");

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "white",
            padding: "5px",
            border: "1px solid #ccc",
          }}
        >
          <p>{dataPoint.label}</p>
          <p>{`Points: ${dataPoint.value}`}</p>
          <p>{`Rank: ${dataPoint.rank}`}</p>
        </div>
      );
    }
    return null;
  };
  return (
    <>
      {loading && <FullScreenLoader />}
      {/* {basicinfo!==null && basicinfo?.basic_info && userName === 'admin' ?  */}
      {userName === "admin" ? (
        <>
          <main className="main-content">
            <section className="row">
              {menuList == null || menuList?.length === 0 ? (
                <>
                  <div className="col-xl-2 col-md-4 col-sm-6 mb-2">
                    <div className="stat-item">
                      <p>Entities</p>
                      <h2>{stats.entityCount}</h2>
                    </div>
                  </div>
                  <div className="col-xl-2 col-md-4 col-sm-6 mb-2">
                    <div className="stat-item">
                      <p>Institutions</p>
                      <h2>{stats.institutionCount}</h2>
                    </div>
                  </div>
                  <div className="col-xl-2 col-md-4 col-sm-6 mb-2">
                    <div className="stat-item">
                      <p>Students</p>
                      <h2>{stats.studentCount}</h2>
                    </div>
                  </div>
                  <div className="col-xl-2 col-md-4 col-sm-6 mb-2">
                    <div className="stat-item">
                      <p>Courses</p>
                      <h2>{stats.courseCount}</h2>
                    </div>
                  </div>
                  <div className="col-xl-2 col-md-4 col-sm-6 mb-2">
                    <div className="stat-item">
                      <p>Subjects</p>
                      <h2>{stats.subjectCount}</h2>
                    </div>
                  </div>
                  <div className="col-xl-2 col-md-4 col-sm-6 mb-2">
                    <div className="stat-item">
                      <p>Departments</p>
                      <h2>{stats.departmentCount}</h2>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to={InstitutionsExists ? "/main/Institute" : "#"}
                    className="col-xl-2 col-md-4 col-sm-6 mb-2 mx-3 stat-item"
                  >
                    <div>
                      <p>Institutions</p>
                      <h2>{stats.institutionCount}</h2>
                    </div>
                  </Link>
                  <Link
                    to={StudentsExists ? "/main/Student" : "#"}
                    className="col-xl-2 col-md-4 col-sm-6 mb-2 mx-3 stat-item"
                  >
                    <div>
                      <p>Students</p>
                      <h2>{stats.studentCount}</h2>
                    </div>
                  </Link>
                  <Link
                    to={CoursesExists ? "/main/Course" : "#"}
                    className="col-xl-2 col-md-4 col-sm-6 mb-2 mx-3 stat-item"
                  >
                    <div>
                      <p>Courses</p>
                      <h2>{stats.courseCount}</h2>
                    </div>
                  </Link>
                  <Link
                    to={SubjectsExists ? "/main/Subject" : "#"}
                    className="col-xl-2 col-md-4 col-sm-6 mb-2 mx-3 stat-item"
                  >
                    <div>
                      <p>Subjects</p>
                      <h2>{stats.subjectCount}</h2>
                    </div>
                  </Link>
                  <Link
                    to={DepartmentExists ? "/main/Department" : "#"}
                    className="col-xl-2 col-md-4 col-sm-6 mb-2 mx-3 stat-item"
                  >
                    <div>
                      <p>Departments</p>
                      <h2>{stats.departmentCount}</h2>
                    </div>
                  </Link>
                </>
              )}
            </section>
            <section className="charts">
              <div className="chart">
                <Bar data={barData} />
              </div>
              <div className="chart">
                <Line data={lineData} />
              </div>
              <div className="chart">
                <PieChart
                  className="pie"
                  series={[
                    {
                      data: pieData,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },
                    },
                  ]}
                  width={450}
                  height={200}
                />
              </div>
            </section>
          </main>
        </>
      ) : userName === "student" ? (
        <>
          <main className="main-content">
            <section className="stats stats12">
              <Link
                to={stats1.Student_Profile === 100 ? "/main/Chat" : ""}
                className="stat-item"
              >
                <div>
                  <p>Starred Chat</p>
                  <h2>{student.chatHistory}</h2>
                </div>
              </Link>
              <Link
                to={stats1.Student_Profile === 100 ? "/main/Chat" : ""}
                className="stat-item stats3"
              >
                <div>
                  <p>Chat</p>
                  <h2>{student.chatCount}</h2>
                </div>
              </Link>
            </section>
            <section className="piecharts">
              <div className="chart">
                <div style={{ marginBottom: "20px" }}>
                  <span
                    style={{
                      fontSize: "1.2rem",
                      color: "#7f8c8d",
                      fontFamily: "sans-serif",
                    }}
                  >
                    Student profile completion
                  </span>
                  <br />
                </div>

                <PieChart
                  className="pie"
                  series={[
                    {
                      data: pieData1,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },
                      valueFormatter: (v, { dataIndex }) => {
                        const { value } = pieData1[dataIndex];
                        return `${value}%`;
                      },
                      cx: 110,
                    },
                  ]}
                  slotProps={{
                    legend: {
                      hidden: true, // Show the legend
                    },
                  }}
                  // width={450}
                  height={200}
                />
                <span className="chart_content">
                  <div
                    style={{
                      width: "20px",
                      height: " 20px",
                      backgroundColor: "#02b2af",
                      marginRight: "10px",
                    }}
                  ></div>
                  Profile completion {stats1?.Student_Profile} %
                </span>
              </div>
            </section>
          </main>
        </>
      ) : (
        // :
        // userName === 'teacher' ?

        //    <>
        //   <main className="main-content">

        //       <Teacher/>
        //     </main>
        //    </>

        <></>
      )}
      <ProfileDialog
        isOpen={dataCompleted}
        onCancel={handlecancel}
        onOkClick={() => handleOk(userName)}
        title="Your profile is incomplete"
      />
    </>
  );
}

export default MainContent;
