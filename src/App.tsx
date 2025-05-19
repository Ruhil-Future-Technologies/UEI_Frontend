/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Route, Routes, useNavigate } from 'react-router-dom';

import Login from './Pages/Login';
import Signup from './Pages/SignUp';
import Profile from './Pages/Profile';
import Main from './Components/Main';
import Chat from './Pages/Chat';
import Protected from './Components/protected/protected';
import Institute from './Pages/Institute/Institute';
import AddEditInstitute from './Pages/Institute/AddEditInstitute';

// import useApi from './hooks/useAPI';
import Entity from './Pages/Entity/Entity';
import AddEditEntity from './Pages/Entity/AddEditEntity';

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
import University from './Pages/University/University';
import Semester from './Pages/Semester/Semester';
import AddSemester from './Pages/Semester/AddSemester';
import AddEditSubjectSchool from './Pages/Subject/AddEditSubjectSchool';
import TeacherDash from './Pages/Teacher/TeacherDashboard';

import NameContext from './Pages/Context/NameContext';
import IntitutionChat from './Pages/Institution/institutionchat';
import InstitutionFeedback from './Pages/Institution/institutionfeedback';
import IntituteMain from './Pages/Institution';
import TeacherMain from './Pages/Teacher';
import TeacherChat from './Pages/Teacher/TeacherChat';
import TeacherFeedback from './Pages/Teacher/TeacherFeedback';
import InstitutionDash from './Pages/Institution/InstituteDashboard';
import InstituteRegistrationForm from './Pages/InstituteRegistrationForm';
import TeacherRegistrationPage from './Pages/TeacherRgistrationForm';
import StudentListingByInstitution from './Pages/Institution/lists/StudentList';
import TeacherListingByInstitution from './Pages/Institution/lists/TeacherList';
import CourseListingByInstitution from './Pages/Institution/lists/CourseList';
import Teacher from './Pages/Teacher/Teacher';
import AddEditTeacher from './Pages/Teacher/AddEditTeacher';
import InstitutionProfile from './Pages/Institution/InstitutionProfile';
import TeacherProfile from './Pages/Teacher/TeacherProfile';
import { StudentDetails } from './Pages/Teacher/StudentDetails';
import { Assignments } from './Pages/Teacher/Assignments';
import { CreateAssignments } from './Pages/Teacher/Assignments/CreateAssignments';
import Content from './Pages/Content/Content';
import AddContent from './Pages/Content/AddContent';
import StudentContent from './Pages/Content/StudentContent';
import ServicesAgreement from './Components/PolicyContent/ServicesAgreement';
import Disclaimer from './Components/PolicyContent/Disclaimer';
import RefundPolicy from './Components/PolicyContent/RefundPolicy';
import PrivacyPolicy from './Components/PolicyContent/PrivacyPolicy';
import AssignmentDetails from './Pages/Teacher/Assignments/assignmentDetails';
import StudentAssignments from './Pages/Student/StudentAssignment';
import PreviewAndSubmit from './Pages/Student/StudentAssignment/previewAndSubmit';
import AdminList from './Pages/AdminList';
import PreviewStudentAssignment from './Pages/Teacher/Assignments/previewStudentAssignment';
import StudentQuiz from './Pages/Student/StudentQuiz';
import QuizPage from './Pages/Student/StudentQuiz/QuizPage';
import TeacherQuizPage from './Pages/Teacher/Quiz';
import { QUERY_KEYS } from './utils/const';
import { toast } from 'react-toastify';
import useApi from './hooks/useAPI';
import ParentDashboard from './Pages/Parent/ParentDashboard';
import ParentMain from './Pages/Parent';
import ParentFeedback from './Pages/Parent/ParentFeedback';
import ParentChat from './Pages/Parent/ParentChat';
import ParentProfile from './Pages/Parent/ParentProfile';

function App() {
  const navigate = useNavigate();
  const context = useContext(NameContext);
  const { setProPercentage }: any = context;
  const synth: SpeechSynthesis = window?.speechSynthesis;
  const user_type = localStorage.getItem('user_type');
  // const StuId = localStorage.getItem('_id');
  const StuId =
    user_type === 'teacher'
      ? localStorage.getItem('teacher_id')
      : localStorage.getItem('student_id');

  const chataddconversationurl = QUERY_KEYS.CHAT_HISTORYCON;
  const { postDataJson } = useApi();

  const saveChat = async () => {
    const chatDataString = localStorage?.getItem('chatData');

    let chatData: any;
    if (chatDataString) {
      chatData = JSON.parse(chatDataString);
    } else {
      chatData = null;
    }

    const isChatFlagged =
      chatData?.[0]?.flagged ?? localStorage?.getItem('chatsaved') === 'true';

    let chat_payload;

    if (Array.isArray(chatData)) {
      chat_payload = {
        [user_type === 'teacher' ? 'teacher_id' : 'student_id']: StuId,
        chat_title: chatData?.[0]?.question,
        chat_conversation: JSON.stringify(chatData),
        flagged: isChatFlagged,
      };

      try {
        await postDataJson(`${chataddconversationurl}`, chat_payload);

        localStorage.removeItem('chatData');
        localStorage.removeItem('chatsaved');
      } catch (e: any) {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      }
    }
  };

  const handlogout = async () => {
    await saveChat();
    setProPercentage(0);
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('userid');
    localStorage.removeItem('pd');
    localStorage.removeItem('userdata');
    localStorage.removeItem('signupdata');
    localStorage.removeItem('user_uuid');
    localStorage.removeItem('menulist');
    localStorage.removeItem('menulist1');
    localStorage.removeItem('proFalg');
    localStorage.removeItem('loglevel');
    sessionStorage.removeItem('profileData');
    localStorage.removeItem('chatsaved');
    localStorage.removeItem('Profile_completion');
    localStorage.removeItem('Profile completion');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('email');
    localStorage.removeItem('phone');
    localStorage.removeItem('student_id');
    localStorage.removeItem('_id');
    localStorage.removeItem('register_num');
    localStorage.removeItem('user_session_data');
    localStorage.removeItem('user_last_sync');
    synth.cancel();
    // logoutpro();
  };
  const handlogoutse = () => {
    // Clear localStorage/sessionStorage and perform logout
    handlogout();
    navigate('/');
  };
  useEffect(() => {
    let inactivityTimer: string | number | NodeJS.Timeout | undefined;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(
        () => {
          handlogoutse();
        },
        15 * 60 * 1000,
      ); // 15 minutes
    };

    // Add event listeners for user activity
    const events = ['click', 'keypress', 'mousemove', 'scroll', 'touchstart'];
    events.forEach((event) => document.addEventListener(event, resetTimer));

    // Start the initial timer
    resetTimer();

    return () => {
      // Cleanup event listeners and timer on unmount
      events.forEach((event) =>
        document.removeEventListener(event, resetTimer),
      );
      clearTimeout(inactivityTimer);
    };
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (token && tokenExpiry) {
      const currentTime = Date.now();
      if (currentTime > parseInt(tokenExpiry)) {
        handlogout();
        navigate('/');
      }
    } else {
      // navigate('/');
    }
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/institute-registration"
          element={<InstituteRegistrationForm />}
        />
        <Route
          path="/teacher-registration"
          element={<TeacherRegistrationPage />}
        />
        <Route path="/profile-chat" element={<ProfileChat />} />
        <Route path="/feedback-chat" element={<Feedback />} />
        <Route path="/institution-dashboard" element={<IntituteMain />}>
          <Route
            path=""
            element={
              <Protected Component={InstitutionDash} menuName="Dashboard" />
            }
          />
          <Route
            path="/institution-dashboard/chat"
            element={<Protected Component={IntitutionChat} menuName="Chat" />}
          />
          <Route
            path="/institution-dashboard/profile"
            element={
              <Protected Component={InstitutionProfile} menuName="Chat" />
            }
          />
          <Route
            path="/institution-dashboard/feedback"
            element={
              <Protected Component={InstitutionFeedback} menuName="feedback" />
            }
          />
          <Route
            path="/institution-dashboard/faq"
            element={<Protected Component={FAQ} menuName="faq" />}
          />
          <Route
            path="/institution-dashboard/student-list"
            element={
              <Protected
                Component={StudentListingByInstitution}
                menuName="student-list"
              />
            }
          />
          <Route
            path="/institution-dashboard/teacher-list"
            element={
              <Protected
                Component={TeacherListingByInstitution}
                menuName="teacher-list"
              />
            }
          />
          <Route
            path="/institution-dashboard/course-list"
            element={
              <Protected
                Component={CourseListingByInstitution}
                menuName="course-list"
              />
            }
          />
          <Route path="/institution-dashboard/Content">
            <Route
              path=""
              element={<Protected Component={Content} menuName="Content" />}
            />
            <Route
              path="add-content"
              element={<Protected Component={AddContent} menuName="Content" />}
            />
            <Route
              path="edit-content/:id"
              element={<Protected Component={AddContent} menuName="Content" />}
            />
          </Route>
        </Route>
        <Route path="/teacher-dashboard" element={<TeacherMain />}>
          <Route
            path=""
            element={
              <Protected Component={TeacherDash} menuName="teacherdash" />
            }
          />
          <Route
            path="/teacher-dashboard/chat"
            element={<Protected Component={TeacherChat} />}
          />
          <Route
            path="/teacher-dashboard/chat/:Id"
            element={<Protected Component={TeacherChat} />}
          />
          <Route
            path="/teacher-dashboard/profile"
            element={<Protected Component={TeacherProfile} />}
          />
          <Route
            path="/teacher-dashboard/feedback"
            element={<Protected Component={TeacherFeedback} />}
          />
          <Route
            path="/teacher-dashboard/faq"
            element={<Protected Component={FAQ} menuName="faq" />}
          />
          <Route
            path="/teacher-dashboard/student-details"
            element={<Protected Component={StudentDetails} />}
          />
          <Route
            path="/teacher-dashboard/assignments"
            element={<Protected Component={Assignments} />}
          />
          <Route
            path="/teacher-dashboard/create-assignment"
            element={<Protected Component={CreateAssignments} />}
          />
          <Route
            path="/teacher-dashboard/create-quiz"
            element={<Protected Component={CreateAssignments} />}
          />{' '}
          <Route
            path="/teacher-dashboard/edit-assignment/:id"
            element={<Protected Component={CreateAssignments} />}
          />
          <Route
            path="/teacher-dashboard/assignment-details/:id"
            element={<Protected Component={AssignmentDetails} />}
          />
          <Route
            path="/teacher-dashboard/student-assignment-details/:id"
            element={<Protected Component={PreviewStudentAssignment} />}
          />
          <Route
            path="/teacher-dashboard/quizzes"
            element={<Protected Component={TeacherQuizPage} />}
          />
          <Route
            path="/teacher-dashboard/quiz-details/:id"
            element={<Protected Component={AssignmentDetails} />}
          />
          <Route
            path="/teacher-dashboard/edit-quiz/:id"
            element={<Protected Component={CreateAssignments} />}
          />
          <Route path="/teacher-dashboard/Content">
            <Route
              path=""
              element={<Protected Component={Content} menuName="Content" />}
            />
            <Route
              path="add-content"
              element={<Protected Component={AddContent} menuName="Content" />}
            />
            <Route
              path="edit-content/:id"
              element={<Protected Component={AddContent} menuName="Content" />}
            />
          </Route>
        </Route>

        <Route path="/parent-dashboard" element={<ParentMain />}>
          <Route
            path=""
            element={
              <Protected Component={ParentDashboard} menuName="parentdash" />
            }
          />
          <Route
            path="/parent-dashboard/chat"
            element={<Protected Component={ParentChat} />}
          />
          <Route
            path="/parent-dashboard/profile"
            element={<Protected Component={ParentProfile} />}
          />
          <Route
            path="/parent-dashboard/feedback"
            element={<Protected Component={ParentFeedback} />}
          />
          <Route
            path="/parent-dashboard/assignments"
            element={
              <Protected Component={StudentAssignments} menuName="content" />
            }
          />
          <Route
            path="/parent-dashboard/quiz"
            element={<Protected Component={StudentQuiz} menuName="content" />}
          />
        </Route>

        {/* <Route path="/admin-feedback-chat" element={<AdminFeedback />} /> */}
        <Route path="/admin-feedback-view" element={<AdminFeedbackView />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/resetpassword" element={<ChangePassword />} />
        <Route path="/chatbot" element={<Chatbot answer={[]} index={0} />} />
        <Route path="/main" element={<Main />}>
          <Route
            path="/main/faq"
            element={<Protected Component={FAQ} menuName="faq" />}
          />
          <Route
            path="/main/chat"
            element={<Protected Component={Chat} menuName="Chat" />}
          />
          <Route
            path="/main/student/content"
            element={
              <Protected Component={StudentContent} menuName="content" />
            }
          />
          <Route
            path="/main/student/assignment"
            element={
              <Protected Component={StudentAssignments} menuName="content" />
            }
          />
          <Route
            path="/main/student/view-and-submit/:id"
            element={
              <Protected Component={PreviewAndSubmit} menuName="content" />
            }
          />

          <Route
            path="/main/student/quiz"
            element={<Protected Component={StudentQuiz} menuName="content" />}
          />
          <Route
            path="/main/student/quiz/:id"
            element={<Protected Component={QuizPage} menuName="content" />}
          />
          <Route
            path="/main/chat"
            element={<Protected Component={Chat} menuName="Chat" />}
          />
          <Route
            path="/main/chat/:Id"
            element={<Protected Component={Chat} menuName="Chat" />}
          />
          <Route path="/main/DashBoard">
            <Route
              path=""
              element={<Protected Component={Dashboard} menuName="DashBoard" />}
            />
          </Route>
          <Route path="/main/Institute">
            <Route
              path=""
              element={<Protected Component={Institute} menuName="Institute" />}
            />
            <Route
              path="add-Institute"
              element={
                <Protected Component={AddEditInstitute} menuName="Institute" />
              }
            />
            <Route
              path="edit-Institute/:id"
              element={
                <Protected Component={AddEditInstitute} menuName="Institute" />
              }
            />
          </Route>
          <Route path="/main/Teacher">
            <Route
              path=""
              element={<Protected Component={Teacher} menuName="Teacher" />}
            />
            <Route
              path="add-Teacher"
              element={
                <Protected Component={AddEditTeacher} menuName="Teacher" />
              }
            />
            <Route
              path="edit-Teacher/:id"
              element={
                <Protected Component={AddEditTeacher} menuName="Teacher" />
              }
            />
          </Route>
          <Route path="/main/Entity">
            <Route
              path=""
              element={<Protected Component={Entity} menuName="Entity" />}
            />
            <Route
              path="add-Entity"
              element={
                <Protected Component={AddEditEntity} menuName="Entity" />
              }
            />
            <Route
              path="edit-Entity/:id"
              element={
                <Protected Component={AddEditEntity} menuName="Entity" />
              }
            />
          </Route>
          <Route path="/main/Class">
            <Route
              path=""
              element={<Protected Component={Class} menuName="Class" />}
            />
            <Route
              path="add-Class"
              element={<Protected Component={AddEditClass} menuName="Class" />}
            />
            <Route
              path="edit-Class/:id"
              element={<Protected Component={AddEditClass} menuName="Class" />}
            />
          </Route>
          <Route path="/main/admin-list">
            <Route
              path=""
              element={
                <Protected Component={AdminList} menuName="Admin List" />
              }
            />
          </Route>
          <Route path="/main/Student">
            <Route
              path=""
              element={<Protected Component={Student} menuName="Student" />}
            />
            <Route
              path="add-Student"
              element={
                <Protected Component={AddEditStudent} menuName="Student" />
              }
            />
            <Route
              path="edit-Student/:id"
              element={
                <Protected Component={AddEditStudent} menuName="Student" />
              }
            />
          </Route>
          <Route path="/main/Course">
            <Route
              path=""
              element={<Protected Component={Course} menuName="Course" />}
            />
            <Route
              path="add-Course"
              element={
                <Protected Component={AddEditCourse} menuName="Course" />
              }
            />
            <Route
              path="edit-Course/:id"
              element={
                <Protected Component={AddEditCourse} menuName="Course" />
              }
            />
          </Route>

          <Route path="/main/Content">
            <Route
              path=""
              element={<Protected Component={Content} menuName="Content" />}
            />
            <Route
              path="add-content"
              element={<Protected Component={AddContent} menuName="Content" />}
            />
            <Route
              path="edit-content/:id"
              element={<Protected Component={AddContent} menuName="Content" />}
            />
          </Route>

          <Route path="/main/University">
            <Route
              path=""
              element={
                <Protected Component={University} menuName="University" />
              }
            />
            <Route
              path="add-University"
              element={
                <Protected Component={AddUniversity} menuName="University" />
              }
            />
            <Route
              path="edit-University/:id"
              element={
                <Protected Component={AddUniversity} menuName="University" />
              }
            />
          </Route>
          <Route path="/main/Semester">
            <Route
              path=""
              element={<Protected Component={Semester} menuName="Semester" />}
            />
            <Route
              path="add-Semester"
              element={
                <Protected Component={AddSemester} menuName="Semester" />
              }
            />
            <Route
              path="edit-Semester/:id"
              element={
                <Protected Component={AddSemester} menuName="Semester" />
              }
            />
          </Route>
          <Route path="/main/Department">
            <Route
              path=""
              element={
                <Protected Component={Department} menuName="Department" />
              }
            />
            <Route
              path="add-Department"
              element={
                <Protected
                  Component={AddEditDepartment}
                  menuName="Department"
                />
              }
            />
            <Route
              path="edit-Department/:id"
              element={
                <Protected
                  Component={AddEditDepartment}
                  menuName="Department"
                />
              }
            />
          </Route>
          <Route path="/main/Subject">
            <Route
              path=""
              element={<Protected Component={Subject} menuName="Subject" />}
            />
            <Route
              path="add-Subject"
              element={
                <Protected Component={AddEditSubject} menuName="Subject" />
              }
            />
            <Route
              path="edit-Subject/:id"
              element={
                <Protected Component={AddEditSubject} menuName="Subject" />
              }
            />
            <Route
              path="add-Subject-school"
              element={
                <Protected
                  Component={AddEditSubjectSchool}
                  menuName="Subject"
                />
              }
            />
            <Route
              path="edit-Subject-school/:id"
              element={
                <Protected
                  Component={AddEditSubjectSchool}
                  menuName="Subject"
                />
              }
            />
          </Route>
          <Route path="/main/Menu">
            <Route
              path=""
              element={<Protected Component={Menu} menuName="Menu" />}
            />
            <Route
              path="add-Menu"
              element={<Protected Component={AddEditMenu} menuName="Menu" />}
            />
            <Route
              path="edit-Menu/:id"
              element={<Protected Component={AddEditMenu} menuName="Menu" />}
            />
          </Route>
          <Route path="/main/SubMenu">
            <Route
              path=""
              element={<Protected Component={Submenu} menuName="SubMenu" />}
            />
            <Route
              path="add-SubMenu"
              element={
                <Protected Component={AddEditSubmenu} menuName="SubMenu" />
              }
            />
            <Route
              path="edit-SubMenu/:id"
              element={
                <Protected Component={AddEditSubmenu} menuName="SubMenu" />
              }
            />
          </Route>
          <Route path="/main/Role">
            <Route
              path=""
              element={<Protected Component={Role} menuName="Role" />}
            />
            <Route
              path="add-Role"
              element={<Protected Component={AddEditRole} menuName="Role" />}
            />
            <Route
              path="edit-Role/:id"
              element={<Protected Component={AddEditRole} menuName="Role" />}
            />
          </Route>
          <Route path="/main/Form">
            <Route
              path=""
              element={<Protected Component={Form} menuName="Form" />}
            />
            <Route
              path="add-Form"
              element={<Protected Component={AddEditForm} menuName="Form" />}
            />
            <Route
              path="edit-Form/:id"
              element={<Protected Component={AddEditForm} menuName="Form" />}
            />
            <Route
              path="/main/Form/404"
              element={<Protected Component={NotFound} menuName="Form" />}
            />
          </Route>
          <Route path="/main/RoleVsForm">
            <Route
              path=""
              element={
                <Protected Component={RolevsForm} menuName="RoleVsForm" />
              }
            />
            <Route
              path="add-RoleVsForm"
              element={
                <Protected
                  Component={AddEditRolevsForm}
                  menuName="RoleVsForm"
                />
              }
            />
            <Route
              path="edit-RoleVsForm/:id"
              element={
                <Protected
                  Component={AddEditRolevsForm}
                  menuName="RoleVsForm"
                />
              }
            />
          </Route>
          <Route path="/main/RoleVsUser">
            <Route
              path=""
              element={
                <Protected Component={RoleVsAdmin} menuName="RoleVsUser" />
              }
            />
            <Route
              path="add-RoleVsAdmin"
              element={
                <Protected
                  Component={AddEditRoleVsAdmin}
                  menuName="RoleVsUser"
                />
              }
            />
            <Route
              path="edit-RoleVsAdmin/:id"
              element={
                <Protected
                  Component={AddEditRoleVsAdmin}
                  menuName="RoleVsUser"
                />
              }
            />
          </Route>
          <Route path="/main/Language">
            <Route
              path=""
              element={<Protected Component={Language} menuName="Language" />}
            />
            <Route
              path="add-Language"
              element={
                <Protected Component={AddEditLanguage} menuName="Language" />
              }
            />
            <Route
              path="edit-Language/:id"
              element={
                <Protected Component={AddEditLanguage} menuName="Language" />
              }
            />
          </Route>
          <Route path="/main/Hobby">
            <Route
              path=""
              element={<Protected Component={Hobby} menuName="Hobby" />}
            />
            <Route
              path="add-Hobby"
              element={<Protected Component={AddEditHobby} menuName="Hobby" />}
            />
            <Route
              path="edit-Hobby/:id"
              element={<Protected Component={AddEditHobby} menuName="Hobby" />}
            />
          </Route>
          <Route path="/main/StudentProfile">
            <Route
              path=""
              element={
                <Protected
                  Component={StudentProfile}
                  menuName={'StudentProfile'}
                />
              }
            />
          </Route>
          <Route path="/main/adminProfile">
            <Route
              path=""
              element={
                <Protected Component={AdminProfile} menuName={'AdminProfile'} />
              }
            />
          </Route>
          <Route path="/main/ChatList">
            <Route
              path=""
              element={<Protected Component={ChatList} menuName="ChatList" />}
            />
          </Route>
          <Route path="/main/Admin">
            <Route
              path=""
              element={<Protected Component={SuperAdmin} menuName="Admin" />}
            />
          </Route>
          <Route path="/main/ChangePassword">
            <Route
              path=""
              element={
                <Protected
                  Component={UserChangePassword}
                  menuName="UserChangePassword"
                />
              }
            />
          </Route>
          <Route path="/main/uploadpdf">
            <Route
              path=""
              element={<Protected Component={Uploadpdf} menuName="uploadpdf" />}
            />
          </Route>
          <Route path="/main/pdflist">
            <Route
              path=""
              element={<Protected Component={PDFList} menuName="pdflist" />}
            />
          </Route>
          {/* <Route path="/main/teacher-deshboard">
            <Route
              path=""
              element={<Protected Component={TeacherDash} menuName="pdflist" />}
            />
          </Route> */}
          <Route path="/main/feedback">
            <Route
              path=""
              element={
                <Protected Component={AdminFeedback} menuName="feedback" />
              }
            />
            <Route
              path="add-feedback"
              element={
                <Protected
                  Component={AddEditAdminFeedback}
                  menuName="feedback"
                />
              }
            />
            <Route
              path="edit-feedback/:id"
              element={
                <Protected
                  Component={AddEditAdminFeedback}
                  menuName="feedback"
                />
              }
            />
          </Route>
          <Route path="/main/student-feedback">
            <Route
              path=""
              element={
                <Protected
                  Component={StudentFeedback}
                  menuName="student-feedback"
                />
              }
            />
            <Route
              path="add-student-feedback"
              element={
                <Protected
                  Component={AddStudentFeedback}
                  menuName="student-feedback"
                />
              }
            />
          </Route>
          <Route path="/main/Studentfeedback">
            <Route
              path=""
              element={
                <Protected
                  Component={StudentFeedback}
                  menuName="Studentfeedback"
                />
              }
            />
            <Route
              path="add-student-feedback"
              element={
                <Protected
                  Component={AddStudentFeedback}
                  menuName="Studentfeedback"
                />
              }
            />
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route
            path="searchdepartment"
            element={<StudentProfileManagement />}
          />
          <Route path="chatbot" element={<Chatbot answer={[]} index={0} />} />
          {/* <Route path="*" element={<Protected Component={NotFound} />} /> */}
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/ServicesAgreement" element={<ServicesAgreement />} />

        <Route path="/RefundPolicy" element={<RefundPolicy />} />
        <Route path="/Disclaimer" element={<Disclaimer />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
      </Routes>
    </div>
  );
}

export default App;
