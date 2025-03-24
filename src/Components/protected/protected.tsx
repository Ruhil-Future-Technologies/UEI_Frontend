/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { hasSubMenu } from '../../utils/helpers';
import NotFound from '../../Pages/NotFound/NotFound';

const Protected = (props: { Component: any; menuName?: string }) => {
  const { Component, menuName } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const logintoken = localStorage.getItem('token');
    if (!logintoken) {
      navigate('/');
    }
  }, []);
  const usertype: any = localStorage?.getItem('user_type');
  // const usertype: any = 'teacher';

  const isDashboard = () => {
    const currentURL = window.location.href;
    const parts = currentURL.split('/');
    const mName = parts[parts.length - 1];
    const uName = parts[parts.length - 2];
    const feedbackRoute =
      parts[parts.length - 2] + '/' + parts[parts.length - 1];
    const MnameExist =
      (usertype === 'admin' && mName?.toLowerCase() === 'dashboard') ||
      (usertype === 'student' && mName?.toLowerCase() === 'dashboard') ||
      (usertype === 'admin' ||
        usertype === 'teacher' ||
        usertype === 'institute'
        ? mName.toLowerCase() === 'adminprofile'
        : '') ||
      (usertype === 'student'
        ? mName.toLowerCase() === 'studentprofile'
        : '') ||
      mName.toLowerCase() === 'changepassword' ||
      (usertype === 'student' ? mName.toLowerCase() === 'chat' : '') ||
      (usertype === 'student' ? mName.toLowerCase() === 'assignment' : '') ||
      (usertype === 'student' ? mName.toLowerCase() === 'view-and-submit' : '') ||
      (usertype === 'admin' ? mName.toLowerCase() === 'uploadpdf' : '') ||
      (usertype === 'admin' ? mName.toLowerCase() === 'pdflist' : '') ||
      (usertype === 'student' ? mName.toLowerCase() === 'recentchat' : '') ||
      (usertype === 'admin' ? mName.toLowerCase() === 'add-feedback' : '') ||
      (usertype === 'admin'
        ? mName.toLowerCase() === 'student-feedback'
        : '') ||
      (usertype === 'student'
        ? mName.toLowerCase() === 'add-student-feedback'
        : '') ||
      (usertype === 'student' ? mName.toLowerCase() === 'faq' : '') ||
      (usertype === 'student' ? mName.toLowerCase() === 'content' : '') ||
      (usertype === 'admin' ? mName.toLowerCase() === 'add-university' : '') ||
      (usertype === 'admin' ? mName.toLowerCase() === 'university' : '') ||
      (usertype === 'admin' ? uName.toLowerCase() === 'edit-university' : '') ||
      (usertype === 'admin' ? mName.toLowerCase() === 'add-semester' : '') ||
      (usertype === 'admin' ? mName.toLowerCase() === 'semester' : '') ||
      (usertype === 'admin' ? uName.toLowerCase() === 'edit-semester' : '') ||
      (usertype === 'admin'
        ? feedbackRoute.toLowerCase() === `edit-feedback/${id}`
        : '') ||
      (usertype === 'admin' ? mName.toLowerCase() === 'teacher' : '') ||
      (usertype === 'admin' ? mName.toLowerCase() === 'add-teacher' : '') ||
      (usertype === 'admin' && uName.toLowerCase() === 'edit-teacher'
        ? true
        : '') ||
      (usertype === 'admin' ? mName.toLowerCase() === 'content' : '') ||
      (usertype === 'admin' ? mName.toLowerCase() === 'add-content' : '') ||
      (usertype === 'admin' && uName.toLowerCase() === 'edit-content'
        ? true
        : '') ||
      (usertype === 'teacher'
        ? mName.toLowerCase() === 'teacher-dashboard'
        : '') ||
      (usertype === 'teacher' && uName.toLowerCase() === 'teacher-dashboard'
        ? mName.toLowerCase() === 'chat'
        : '') ||
      (usertype === 'teacher' && uName.toLowerCase() === 'teacher-dashboard'
        ? mName.toLowerCase() === 'feedback'
        : '') ||
      (usertype === 'teacher' && uName.toLowerCase() === 'teacher-dashboard'
        ? mName.toLowerCase() === 'profile'
        : '') ||
      (usertype === 'teacher' ? mName.toLowerCase() === 'content' : '') ||
      (usertype === 'teacher' ? mName.toLowerCase() === 'add-content' : '') ||
      (usertype === 'teacher' && uName.toLowerCase() === 'edit-content'
        ? true
        : '') ||
      (usertype === 'teacher' && uName.toLowerCase() === 'teacher-dashboard'
        ? mName.toLowerCase() === 'student-details'
        : '') ||
      (usertype === 'teacher' && uName.toLowerCase() === 'teacher-dashboard'
        ? mName.toLowerCase() === 'assignments'
        : '') ||
      (usertype === 'teacher' && uName.toLowerCase() === 'teacher-dashboard'
        ? mName.toLowerCase() === 'create-assignment'
        : '') ||
      (usertype === 'teacher' &&
        uName.toLowerCase() === 'edit-assignment' &&
        parts[parts.length - 3]?.toLowerCase() === 'teacher-dashboard') ||

      (usertype === 'teacher' &&
        uName.toLowerCase() === 'assignment-details' &&
        parts[parts.length - 3]?.toLowerCase() === 'teacher-dashboard') ||

      (usertype === 'teacher' ? mName.toLowerCase() === 'content' : '') ||
      (usertype === 'teacher' ? mName.toLowerCase() === 'add-content' : '') ||
      (usertype === 'teacher' && uName.toLowerCase() === 'edit-content'
        ? true
        : '') ||

      (usertype === 'institute'
        ? mName.toLowerCase() === 'institution-dashboard'
        : '') ||
      (usertype === 'institute' &&
        uName.toLowerCase() === 'institution-dashboard'
        ? mName.toLowerCase() === 'chat'
        : '') ||
      (usertype === 'institute' &&
        uName.toLowerCase() === 'institution-dashboard'
        ? mName.toLowerCase() === `teacher-list`
        : '') ||
      (usertype === 'institute' &&
        uName.toLowerCase() === 'institution-dashboard'
        ? mName.toLowerCase() === 'student-list'
        : '') ||
      (usertype === 'institute' &&
        uName.toLowerCase() === 'institution-dashboard'
        ? mName.toLowerCase() === 'course-list'
        : '') ||
      (usertype === 'institute' &&
        uName.toLowerCase() === 'institution-dashboard'
        ? mName.toLowerCase() === 'feedback'
        : '') ||
      (usertype === 'institute' &&
        uName.toLowerCase() === 'institution-dashboard'
        ? mName.toLowerCase() === 'profile'
        : '') ||
      (usertype === 'institute' ? mName.toLowerCase() === 'content' : '') ||
      (usertype === 'institute' ? mName.toLowerCase() === 'add-content' : '') ||
      (usertype === 'institute' && uName.toLowerCase() === 'edit-content'
        ? true
        : '') ||
      (usertype === 'admin' && mName?.toLowerCase() === 'servicesagreement') ||
      (usertype === 'admin' && mName?.toLowerCase() === 'privacypolicy') ||
      (usertype === 'admin' && mName?.toLowerCase() === 'refundpolicy') ||
      (usertype === 'admin' && mName?.toLowerCase() === 'disclaimer');

    return MnameExist;
  };

  const isAllowed = () => {
    const menuList = localStorage.getItem('menulist1')
      ? JSON.parse(localStorage.getItem('menulist1') as string)
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
