import { RouteObject } from "react-router-dom";
import Login from "../Login";
import Signup from "../SignUp";

import Entity from "../Entity/Entity";
import Main from "../../Components/Main";
import { Chat } from "@mui/icons-material";
import Dashboard from "../Dashboard/Dashboard";
import Institute from "../Institute/Institute";
import Student from "../Student/Student";
import Department from "../Department/Department";

import Subject from "../Subject/Subject";
import Course from "../Course/Course";
import Menu from "../Menu/Menu";
import Submenu from "../Submenu/Submenu";
import Role from "../Role/Role";
import Form from "../Form/Form";
import RolevsForm from "../RolevsForm/RolevsForm";
import RoleVsAdmin from "../RolevsAdmin/RolevsAdmin";
import Language from "../Language/Language";
import Hobby from "../Hobby/Hobby";
import ChatList from "../ChatList/ChatList";
import SuperAdmin from "../SuperAdmin/SuperAdmin";
import Class from "../Class/Class";
import Uploadpdf from "../Uploadpdf/Uploadpdf";
import PDFList from "../PDFList/PDFList";
import AdminFeedback from "../AdminFeedback/AdminFeedback";
import StudentFeedback from "../AdminFeedback/StudentFeedback";
import FAQ from "../../Components/FAQ/FAQ";

export const routes: RouteObject[] = [
  //   { path: "/", element: <Login /> },
  //   { path: "/signup", element: <Signup /> },
  { path: "/main/Entity", element: <Entity /> },
  { path: "/main", element: <Main /> },
  { path: "/main/chat", element: <Chat /> },
  { path: "/main/DashBoard", element: <Dashboard /> },
  { path: "/main/Institute", element: <Institute /> },
  { path: "/main/Student", element: <Student /> },
  { path: "/main/Course", element: <Course /> },
  { path: "/main/Department", element: <Department /> },
  { path: "/main/Subject", element: <Subject /> },
  { path: "/main/Subject", element: <Subject /> },
  { path: "/main/Menu", element: <Menu /> },
  { path: "/main/SubMenu", element: <Submenu /> },
  { path: "/main/Role", element: <Role /> },
  { path: "/main/Form", element: <Form /> },
  { path: "/main/RoleVsForm", element: <RolevsForm /> },
  { path: "/main/RoleVsUser", element: <RoleVsAdmin /> },
  { path: "/main/Language", element: <Language /> },
  { path: "/main/Hobby", element: <Hobby /> },
  { path: "/main/ChatList", element: <ChatList /> },
  { path: "/main/SuperAdmin", element: <SuperAdmin /> },
  { path: "/main/Class", element: <Class /> },
  { path: "/main/UploadPdf", element: <Uploadpdf /> },
  { path: "/main/PdfList", element: <PDFList /> },
  { path: "/main/feedback", element: <AdminFeedback /> },
  { path: "/main/student-feedback", element: <StudentFeedback /> },
  { path: "/main/StudentFeedback", element: <StudentFeedback /> },
  { path: "/main/faq", element: <FAQ /> },
];
