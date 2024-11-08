import React, { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css';
import logo from './logo.svg';
import { Route, Router, Routes, useNavigate,RouteObject  } from 'react-router-dom';

import Login from './Pages/Login';
import Signup from './Pages/SignUp';
import Profile from './Pages/Profile';
import Main from './Components/Main';
import Chat from './Pages/Chat';
import Protected from './Components/protected/protected';
import Institute from './Pages/Institute/Institute';
import AddEditInstitute from './Pages/Institute/AddEditInstitute';

import useApi from './hooks/useAPI';
import Entity from './Pages/Entity/Entity';
import AddEditEntity from './Pages/Entity/AddEditEntity';
import AddDepartment from './Pages/AddDepartment';
import SearchDepartment from './Pages/SearchDepartment';
import Student from './Pages/Student/Student';
import AddEditStudent from './Pages/Student/AddEditStudent';
import Course from './Pages/Course/Course';
import AddEditCourse from './Pages/Course/AddEditCourse';
import Department from './Pages/Department/Department';
import AddEditDepartment from './Pages/Department/AddEditDepartment';
import AddEditSubject from './Pages/Subject/AddEditSubject';
import Subject from './Pages/Subject/Subject';
import Menu from './Pages/Menu/Menu';
import AddEditMenu from './Pages/Menu/AddEditMenu';
import AddEditSubmenu from './Pages/Submenu/AddEditSubmenu';
import Submenu from './Pages/Submenu/Submenu';
import ProfileChat from './Pages/ProfileChat';
import Role from './Pages/Role/Role';
import AddEditRole from './Pages/Role/AddEditRole';
import AddEditForm from './Pages/Form/AddEditform';
import Form from './Pages/Form/Form';
import Forgotpassword from './Pages/ForgotPassword';
import ChangePassword from './Pages/ChangePassword';
import RolevsForm from './Pages/RolevsForm/RolevsForm';
import AddEditRolevsForm from './Pages/RolevsForm/AddEditRolevsForm';
import AddEditLanguage from './Pages/Language/AddEditLanguage';
import Language from './Pages/Language/Language';
import StudentProfile from './Pages/StudentProfile';
import Hobby from './Pages/Hobby/Hobby';
import AddEditHobby from './Pages/Hobby/AddEditHobby';
import RoleVsAdmin from './Pages/RolevsAdmin/RolevsAdmin';
import AddEditRoleVsAdmin from './Pages/RolevsAdmin/AddEditRolevsAdmin';
import StudentProfileManagement from './Pages/studentProfileMgt';
import AdminProfile from './Pages/AdminProfile';
import Dashboard from './Pages/Dashboard/Dashboard';
import Chatbot from './Pages/Chatbot';
import NotFound from './Pages/NotFound/NotFound';
import ChatList from './Pages/ChatList/ChatList';
import SuperAdmin from './Pages/SuperAdmin/SuperAdmin';
import UserChangePassword from './Pages/UserChangePassword';
import AdminFeedbackView from './Pages/adminFeedbackView';

import Feedback from './Pages/UserFeedBack';

import Teacher from './Pages/Uploadpdf/Uploadpdf';
import Uploadpdf from './Pages/Uploadpdf/Uploadpdf';
import AddEditAdminFeedback from './Pages/AdminFeedback/AddEditAdminFeedback';
import AdminFeedback from './Pages/AdminFeedback/AdminFeedback';
import StudentFeedback from './Pages/AdminFeedback/StudentFeedback';
import AddStudentFeedback from './Pages/StudentFeedback/AddStudentFeedback';


import Class from './Pages/Class/Class';
import AddEditClass from './Pages/Class/AddEditClass';
import PDFList from './Pages/PDFList/PDFList';
import FAQ from './Components/FAQ/FAQ';
import AddUniversity from './Pages/University/AddUniversity';
import Univesity from './Pages/University/University';
import University from './Pages/University/University';
import Semester from './Pages/Semester/Semester';
import AddSemester from './Pages/Semester/AddSemester';
import AddEditSubjectSchool from './Pages/Subject/AddEditSubjectSchool';
// import "./assets/css/main.min.css";
// import "./assets/css/newstyle.min.css";
// import "./assets/css/main.scss";
// import "./assets/css/newstyle.scss";


// import "./assets/css/main.min.css";
// import "./assets/css/newstyle.min.css";
// import "./assets/css/main.min.css";
// import "./assets/css/newstyle.min.css";
// import { jwtDecode, JwtPayload } from 'jwt-decode';

function App() {

  // const loginUrl = `https://13.235.239.244/auth/login`;
   const loginUrl = "https://qaapi.gyansetu.ai/";

  // const loginUrl = `http://127.0.0.1:5000/login`;
  const { postData } = useApi();
  const navigate = useNavigate()

  // setInterval(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     navigate("/")
  //     // refreshToken()
  //   }
  // }, 3000000)
  // useEffect(() => {
  //   console.log("test inteval useeffect")
  //   const intervalId = setInterval(() => {
  //     console.log("test inteval in 1 hour")
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       try {
  //         const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
  //         const currentTime = Date.now() / 1000; // Current time in seconds

  //         if (decodedToken.exp && decodedToken.exp < currentTime) {
  //           // Token has expired
  //           localStorage.removeItem("token");
  //           localStorage.removeItem("_id");
  //           navigate("/"); // Redirect to login page
  //         } else {
  //           // Token is valid
  //           const login_id = localStorage.getItem("_id");
  //           if (login_id) {
  //             navigate("/main/DashBoard");
  //           }
  //         }
  //       } catch (error) {
  //         // Invalid token
  //         localStorage.removeItem("token");
  //         localStorage.removeItem("_id");
  //         navigate("/"); // Redirect to login page
  //       }
  //     } else {
  //       navigate("/"); // Redirect to login page if no token found
  //     }
  //   }, 3600000); // 1 hour interval

  //   return () => clearInterval(intervalId); // Cleanup interval on component unmount
  // }, [navigate]);



  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
// console.log("test expire time",tokenExpiry)
    if (token && tokenExpiry) {
      const currentTime = Date.now();
      // console.log("test expire time in",currentTime,tokenExpiry)
      if (currentTime > parseInt(tokenExpiry)) {
        // console.log("test expire time finally done",currentTime,tokenExpiry)
        // Token has expired
        // localStorage.removeItem('token');
        // localStorage.removeItem('tokenExpiry');
        navigate('/');
      }
    } else {
      // navigate('/');
    }
  }, [navigate]); 

  const refreshToken = async () => {
    const userid = localStorage.getItem('userid');
    const user_type = localStorage.getItem('user_type');
    const password = localStorage.getItem('pd');
    let UserSignUp = {
      userid: String(userid),
      password: String(password),
      user_type: String(user_type)
    };
    postData(`${loginUrl}`, UserSignUp).then((data: { status: number; token: string; data: { id: number, user_type: string, userid: string } }) => {
      if (data?.status === 200) {
        localStorage.setItem('token', data?.token);
        localStorage.setItem('userdata', JSON.stringify(data?.data));
      } else {
        // setIssuccess(true)
        // setMsg(data?.message)
      }
    });
  };

  return (
    <div className="App">
       <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile-chat" element={<ProfileChat />} />
        <Route path="/feedback-chat" element={<Feedback />} />
        {/* <Route path="/admin-feedback-chat" element={<AdminFeedback />} /> */}
        <Route path="/admin-feedback-view" element={<AdminFeedbackView/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/chatbot" element={<Chatbot answer={[]} index={0} />} />
        <Route path="/main" element={<Main />}>
          <Route path="/main/faq" element={<Protected Component={FAQ} menuName="faq" />} />
          <Route path="/main/chat" element={<Protected Component={Chat} menuName="Chat" />} />
          <Route path="/main/chat" element={<Protected Component={Chat} menuName="Chat" />} />
          <Route path="/main/chat/:Id" element={<Protected Component={Chat} menuName="Chat" />} />
          <Route path="/main/DashBoard">
            <Route path="" element={<Protected Component={Dashboard} menuName="DashBoard" />} />
          </Route>
          <Route path="/main/Institute">
            <Route path="" element={<Protected Component={Institute} menuName="Institute" />} />
            <Route path="add-Institute" element={<Protected Component={AddEditInstitute} menuName="Institute" />} />
            <Route
              path="edit-Institute/:id"
              element={<Protected Component={AddEditInstitute}  menuName="Institute" />}
            />
          </Route>
          <Route path="/main/Entity" >
            <Route path="" element={<Protected Component={Entity} menuName="Entity"/>} />
            <Route path="add-Entity" element={<Protected Component={AddEditEntity} menuName="Entity"/>}  />
            <Route
              path="edit-Entity/:id"
              element={<Protected Component={AddEditEntity} menuName="Entity" />}
            />
          </Route>
          <Route path="/main/Class" >
            <Route path="" element={<Protected Component={Class} menuName="Class"/>} />
            <Route path="add-Class" element={<Protected Component={AddEditClass} menuName="Class"/>}  />
            <Route
              path="edit-Class/:id"
              element={<Protected Component={AddEditClass} menuName="Class" />}
            />
            </Route>
          <Route path="/main/Student" >
            <Route path="" element={<Protected Component={Student}   menuName="Student"/>} />
            <Route path="add-Student" element={<Protected Component={AddEditStudent} menuName="Student" />} />
            <Route
              path="edit-Student/:id"
              element={<Protected Component={AddEditStudent}  menuName="Student" />}
            />
          </Route>
          <Route path="/main/Course">
            <Route path="" element={<Protected Component={Course} menuName="Course" />} />
            <Route path="add-Course" element={<Protected Component={AddEditCourse} menuName="Course" />} />
            <Route
              path="edit-Course/:id"
              element={<Protected Component={AddEditCourse} menuName="Course" />}
            />
          </Route>
          <Route path="/main/University">
            <Route path="" element={<Protected Component={University} menuName="University" />} />
            <Route path="add-University" element={<Protected Component={AddUniversity} menuName="University" />} />
            <Route
              path="edit-University/:id"
              element={<Protected Component={AddUniversity} menuName="University" />}
            />
          </Route>
          <Route path="/main/Semester">
            <Route path="" element={<Protected Component={Semester} menuName="Semester" />} />
            <Route path="add-Semester" element={<Protected Component={AddSemester} menuName="Semester" />} />
            <Route
              path="edit-Semester/:id"
              element={<Protected Component={AddSemester} menuName="Semester" />}
            />
          </Route>
          <Route path="/main/Department" >
            <Route path="" element={<Protected Component={Department} menuName="Department" />} />
            <Route path="add-Department" element={<Protected Component={AddEditDepartment} menuName="Department" />} />
            <Route
              path="edit-Department/:id"
              element={<Protected Component={AddEditDepartment} menuName="Department" />}
            />
          </Route>
          <Route path="/main/Subject">
            <Route path="" element={<Protected Component={Subject} menuName="Subject" />} />
            <Route path="add-Subject" element={<Protected Component={AddEditSubject} menuName="Subject" />} />
            <Route
              path="edit-Subject/:id"
              element={<Protected Component={AddEditSubject}  menuName="Subject" />}
            />
            <Route path="add-Subject-school" element={<Protected Component={AddEditSubjectSchool} menuName="Subject" />} />
            <Route
              path="edit-Subject-school/:id"
              element={<Protected Component={AddEditSubjectSchool}  menuName="Subject" />}
            />
          </Route>
          <Route path="/main/Menu">
            <Route path="" element={<Protected Component={Menu}  menuName="Menu"/>} />
            <Route path="add-Menu" element={<Protected Component={AddEditMenu}  menuName="Menu"/>} />
            <Route
              path="edit-Menu/:id"
              element={<Protected Component={AddEditMenu}  menuName="Menu" />}
            />
          </Route>
          <Route path="/main/SubMenu"  >
            <Route path="" element={<Protected Component={Submenu} menuName="SubMenu" />} />
            <Route path="add-SubMenu" element={<Protected Component={AddEditSubmenu} menuName="SubMenu"/>} />
            <Route
              path="edit-SubMenu/:id"
              element={<Protected Component={AddEditSubmenu} menuName="SubMenu" />}
            />
          </Route>
          <Route path="/main/Role" >
            <Route path="" element={<Protected Component={Role} menuName="Role" />} />
            <Route path="add-Role" element={<Protected Component={AddEditRole} menuName="Role" />} />
            <Route
              path="edit-Role/:id"
              element={<Protected Component={AddEditRole} menuName="Role" />}
            />
          </Route>
          <Route path="/main/Form" >
            <Route path="" element={<Protected Component={Form}  menuName="Form" />} />
            <Route path="add-Form" element={<Protected Component={AddEditForm}  menuName="Form" />} />
            <Route
              path="edit-Form/:id"
              element={<Protected Component={AddEditForm}  menuName="Form" />}
            />
            <Route path="/main/Form/404" element={<Protected Component={NotFound}  menuName="Form"/>} />
          </Route>
          <Route path="/main/RoleVsForm">
            <Route path="" element={<Protected Component={RolevsForm} menuName="RoleVsForm"/>} />
            <Route path="add-RoleVsForm" element={<Protected Component={AddEditRolevsForm} menuName="RoleVsForm" />} />
            <Route
              path="edit-RoleVsForm/:id"
              element={<Protected Component={AddEditRolevsForm} menuName="RoleVsForm" />}
            />
          </Route>
          <Route path="/main/RoleVsUser">
            <Route path="" element={<Protected Component={RoleVsAdmin}  menuName="RoleVsUser"/>} />
            <Route path="add-RoleVsAdmin" element={<Protected Component={AddEditRoleVsAdmin}   menuName="RoleVsUser" />} />
            <Route
              path="edit-RoleVsAdmin/:id"
              element={<Protected Component={AddEditRoleVsAdmin}  menuName="RoleVsUser" />}
            />
          </Route>
          <Route path="/main/Language">
            <Route path="" element={<Protected Component={Language} menuName="Language" />} />
            <Route path="add-Language" element={<Protected Component={AddEditLanguage} menuName="Language" />} />
            <Route
              path="edit-Language/:id"
              element={<Protected Component={AddEditLanguage} menuName="Language" />}
            />
          </Route>
          <Route path="/main/Hobby" >
            <Route path="" element={<Protected Component={Hobby} menuName="Hobby" />} />
            <Route path="add-Hobby" element={<Protected Component={AddEditHobby}  menuName="Hobby"/>} />
            <Route
              path="edit-Hobby/:id"
              element={<Protected Component={AddEditHobby} menuName="Hobby" />}
            />
          </Route>
          <Route path="/main/StudentProfile">
            <Route path="" element={ <Protected Component={StudentProfile}  menuName={"StudentProfile"}/>} />
          </Route>
          <Route path="/main/adminProfile">
            <Route path="" element={<Protected Component={AdminProfile}  menuName={"AdminProfile"}  />} />
          </Route>
          <Route path="/main/ChatList">
            <Route path="" element={<Protected Component={ChatList} menuName="ChatList" />} />
          </Route>
          <Route path="/main/SuperAdmin" >
            <Route path="" element={<Protected Component={SuperAdmin} menuName="SuperAdmin" />} />
          </Route>
          <Route path="/main/ChangePassword">
            <Route path="" element={< Protected Component={UserChangePassword} menuName="UserChangePassword"/>} />
          </Route>
          <Route path="/main/uploadpdf">
            <Route path="" element={<Protected Component={Uploadpdf} menuName="uploadpdf" />} />
          </Route>
          <Route path="/main/pdflist">
            <Route path="" element={<Protected Component={PDFList} menuName="pdflist" />} />
          </Route>
          <Route path="/main/feedback">
            <Route path="" element={<Protected Component={AdminFeedback} menuName="feedback" />} />
            <Route path="add-feedback" element={<Protected Component={AddEditAdminFeedback} menuName="feedback" />} />
            <Route path="edit-feedback/:id" element={<Protected Component={AddEditAdminFeedback} menuName="feedback" />} />
          </Route>
          <Route path="/main/student-feedback">
            <Route path="" element={<Protected Component={StudentFeedback} menuName="student-feedback" />} />
            <Route path="add-student-feedback" element={<Protected Component={AddStudentFeedback} menuName="student-feedback" />} />
          </Route>
          <Route path="/main/Studentfeedback">
            <Route path="" element={<Protected Component={StudentFeedback} menuName="Studentfeedback" />} />
            <Route path="add-student-feedback" element={<Protected Component={AddStudentFeedback} menuName="Studentfeedback" />} />
          </Route>
        </Route>
        <Route path="profile" element={<Profile />} />
        <Route path="adddepartment" element={<AddDepartment />} />
        <Route path="searchdepartment" element={<StudentProfileManagement />} />
        <Route path="chatbot" element={<Chatbot answer={[]} index={0} />} />
        {/* <Route path="*" element={<Protected Component={NotFound} />} /> */}
        <Route path="*" element={<NotFound/>}  />
        
      </Routes>
    </div>
  );
}

export default App;
