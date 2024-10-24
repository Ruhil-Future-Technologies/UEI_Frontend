import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hasSubMenu } from "../../utils/helpers";
import { QUERY_KEYS_MENU } from "../../utils/const";
import useApi from "../../hooks/useAPI";
import NotFound from "../../Pages/NotFound/NotFound";

const Protected = (props: { Component: any; menuName?: string }) => {
  const { Component, menuName } = props;
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    let logintoken = localStorage.getItem("token");
    if (!logintoken) {
      navigate("/");
    }
  }, []);
  const usertype: any = localStorage?.getItem("user_type");
  const isDashboard = () => {
    const currentURL = window.location.href;
    const parts = currentURL.split("/");
    const mName = parts[parts.length - 1];
    const uName = parts[parts.length - 2];
    const feedbackRoute =
      parts[parts.length - 2] + "/" + parts[parts.length - 1];
    const MnameExist =
      mName?.toLowerCase() === "dashboard" ||
      (usertype === "admin"
        ? mName.toLowerCase() === "adminprofile"
        : mName.toLowerCase() === "studentprofile") ||
      mName.toLowerCase() === "changepassword" ||
      (usertype === "admin" ? "" : mName.toLowerCase() === "chat") ||
      (usertype === "admin" ? mName.toLowerCase() === "uploadpdf" : "") ||
      (usertype === "admin" ? mName.toLowerCase() === "pdflist" : "") ||
      (usertype === "student" ? mName.toLowerCase() === "recentchat" : "") ||
      (usertype === "admin" ? mName.toLowerCase() === "feedback" : "") ||
      (usertype === "admin" ? mName.toLowerCase() === "add-feedback" : "") ||
      (usertype === "admin" ? mName.toLowerCase() === "student-feedback" : "") ||
      (usertype === "student" ? mName.toLowerCase() === "add-student-feedback" : "") ||
      (usertype === "student" ? mName.toLowerCase() === "faq" : "") ||
      (usertype === "admin" ? mName.toLowerCase() === "add-university" : "") ||
      (usertype === "admin" ? mName.toLowerCase() === "university" : "") ||
      (usertype === "admin" ? uName.toLowerCase() === "edit-university" : "") ||
      (usertype === "admin" ? mName.toLowerCase() === "add-semester" : "") ||
      (usertype === "admin" ? mName.toLowerCase() === "semester" : "") ||
      (usertype === "admin" ? uName.toLowerCase() === "edit-semester" : "") ||
      (usertype === "admin"
        ? feedbackRoute.toLowerCase() === `edit-feedback/${id}`
        : "");
    return MnameExist;
  };

  const isAllowed = () => {
    const menuList = localStorage.getItem("menulist1")
      ? JSON.parse(localStorage.getItem("menulist1") as string)
      : [];
    return hasSubMenu(menuList, menuName);
  };
  return (
    <>
      {isAllowed() || isDashboard() ? <Component /> : <NotFound />}
      {/* <Component />  */}
    </>
  );
};

export default Protected;
