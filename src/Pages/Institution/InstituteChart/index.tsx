/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import './InstitutionCharts.scss';
import { ApexOptions } from 'apexcharts';
import useApi from '../../../hooks/useAPI';
import {
  QUERY_KEYS,
  QUERY_KEYS_STUDENT,
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL,
  QUERY_KEYS_TEACHER,
} from '../../../utils/const';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const InstitutionCharts = () => {
  const { getData } = useApi();
  const TEACHERURL = QUERY_KEYS_TEACHER.GET_TEACHER;
  const STUDENTURL = QUERY_KEYS_STUDENT.GET_STUDENT;
  const SUBJECTURL = QUERY_KEYS_SUBJECT.GET_SUBJECT;
  const INSTITUTEURL = QUERY_KEYS.INSTITUTE_EDIT;
  const SUBJECT_SCHOOL_URL = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT;
  const [teacherAll, setTeacherAll] = useState<any[]>([]);
  const [studentAll, setStudentAll] = useState<any[]>([]);
  const [subjectAll, setSubjectAll] = useState<any[]>([]);
  const [schoolSubjectAll, setschoolSubjectAll] = useState<any>([]);
  const [semesterAll, setSemesterAll] = useState<any[]>([]);
  const institute_id = localStorage.getItem('institute_id');
  const user_uuid = localStorage.getItem('user_uuid');
  const [institute, setInstitute] = useState<any>([]);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState<any>([]);

  const [activeMonth, setActiveMonth] = useState('Jan');
  const [activeTab, setActiveTab] = useState('weekly');
  const [topUsers, setTopUsers] = useState<any>({
    teachers: [],
    students: [],
  });

  const [sessionData, setSessionData] = useState<any>({});
  const [assignmentData, setAssignmentData] = useState<any>({});
  const [userData, setUserData] = useState<any>({});

  const [subjectData, setSubjectData] = useState<any>({});

  const uniqueCourses = [
    ...new Set(subjectAll.map((item) => item.course_id)),
  ].map((courseId) => {
    return {
      course_id: courseId,
      course_name: subjectAll.find((item) => item.course_id === courseId)
        .course_name,
    };
  });

  const uniqueClasses = [
    ...new Set(schoolSubjectAll.map((item: any) => item.class_id)),
  ].map((classId) => {
    return {
      class_id: classId,
      class_name: schoolSubjectAll.find(
        (item: any) => item.class_id === classId,
      ).class_name,
    };
  });

  const filteredSemesters = useMemo(() => {
    return semesterAll.filter(
      (semester) => semester.course_id === selectedCourse,
    );
  }, [selectedCourse]);

  useEffect(() => {
    const fetchData = async () => {};
    // let session: any = "await getData(`${'call session api '}`)";
    // session = {
    //   teachers: {
    //     '3c0a895e-7fa0-4926-a37d-02580d634cf7': {
    //       Jan: {
    //         total: 187,
    //         week1: { days: [3, 7, 2, 8, 1, 4, 6], total: 42 },
    //         week2: { days: [5, 0, 9, 2, 7, 3, 1], total: 37 },
    //         week3: { days: [6, 2, 4, 8, 0, 5, 7], total: 48 },
    //         week4: { days: [1, 3, 7, 9, 2, 6, 4], total: 39 },
    //       },
    //       Feb: {
    //         total: 165,
    //         week1: { days: [4, 8, 1, 5, 7, 2, 0], total: 45 },
    //         week2: { days: [2, 6, 3, 9, 4, 1, 7], total: 41 },
    //         week3: { days: [7, 1, 5, 8, 3, 6, 2], total: 50 },
    //         week4: { days: [0, 4, 6, 2, 9, 5, 8], total: 38 },
    //       },
    //       March: {
    //         total: 192,
    //         week1: { days: [9, 3, 7, 1, 4, 8, 2], total: 47 },
    //         week2: { days: [5, 2, 6, 0, 7, 3, 9], total: 43 },
    //         week3: { days: [8, 4, 1, 6, 2, 5, 7], total: 49 },
    //         week4: { days: [3, 7, 0, 9, 4, 8, 1], total: 44 },
    //       },
    //     },
    //     '4493d988-f834-484e-adf9-5c53ab486259': {
    //       Jan: {
    //         total: 178,
    //         week1: { days: [2, 5, 8, 1, 7, 3, 6], total: 40 },
    //         week2: { days: [4, 9, 2, 7, 0, 5, 8], total: 46 },
    //         week3: { days: [6, 1, 4, 9, 3, 7, 2], total: 39 },
    //         week4: { days: [0, 8, 5, 2, 6, 4, 1], total: 43 },
    //       },
    //       Feb: {
    //         total: 190,
    //         week1: { days: [7, 3, 6, 0, 9, 2, 5], total: 48 },
    //         week2: { days: [1, 4, 8, 3, 7, 6, 2], total: 44 },
    //         week3: { days: [5, 2, 9, 4, 8, 1, 7], total: 47 },
    //         week4: { days: [3, 6, 0, 5, 2, 9, 4], total: 41 },
    //       },
    //       March: {
    //         total: 175,
    //         week1: { days: [8, 1, 5, 7, 3, 6, 2], total: 45 },
    //         week2: { days: [4, 9, 2, 6, 0, 7, 3], total: 42 },
    //         week3: { days: [1, 7, 4, 8, 2, 5, 9], total: 46 },
    //         week4: { days: [6, 3, 0, 9, 4, 8, 1], total: 40 },
    //       },
    //     },
    //     '4796978c-526c-47a3-85f0-b699ecb75ea2': {
    //       Jan: {
    //         total: 182,
    //         week1: { days: [3, 6, 1, 8, 4, 7, 2], total: 44 },
    //         week2: { days: [5, 2, 9, 0, 6, 3, 7], total: 41 },
    //         week3: { days: [8, 4, 2, 7, 1, 5, 9], total: 47 },
    //         week4: { days: [0, 7, 3, 6, 2, 8, 4], total: 43 },
    //       },
    //       Feb: {
    //         total: 168,
    //         week1: { days: [9, 1, 5, 3, 7, 2, 6], total: 45 },
    //         week2: { days: [4, 8, 0, 5, 9, 1, 7], total: 42 },
    //         week3: { days: [2, 6, 3, 8, 4, 7, 1], total: 46 },
    //         week4: { days: [7, 0, 4, 9, 2, 5, 8], total: 40 },
    //       },
    //       March: {
    //         total: 195,
    //         week1: { days: [1, 5, 8, 2, 6, 3, 9], total: 47 },
    //         week2: { days: [4, 7, 0, 6, 1, 8, 2], total: 43 },
    //         week3: { days: [3, 9, 4, 7, 2, 5, 8], total: 48 },
    //         week4: { days: [6, 2, 5, 0, 9, 4, 7], total: 41 },
    //       },
    //     },
    //     'c005054e-e7d7-4f58-a18f-a102698c40c9': {
    //       Jan: {
    //         total: 176,
    //         week1: { days: [2, 7, 4, 9, 1, 6, 3], total: 42 },
    //         week2: { days: [5, 0, 8, 3, 7, 2, 4], total: 45 },
    //         week3: { days: [6, 1, 5, 8, 0, 9, 2], total: 47 },
    //         week4: { days: [3, 7, 2, 6, 4, 8, 1], total: 43 },
    //       },
    //       Feb: {
    //         total: 185,
    //         week1: { days: [9, 3, 6, 2, 7, 4, 8], total: 46 },
    //         week2: { days: [1, 5, 0, 7, 3, 9, 2], total: 44 },
    //         week3: { days: [4, 8, 1, 6, 2, 5, 7], total: 48 },
    //         week4: { days: [0, 9, 3, 5, 8, 1, 6], total: 41 },
    //       },
    //       March: {
    //         total: 180,
    //         week1: { days: [7, 2, 5, 9, 4, 8, 1], total: 47 },
    //         week2: { days: [3, 6, 0, 8, 2, 7, 4], total: 43 },
    //         week3: { days: [5, 1, 9, 4, 6, 3, 8], total: 45 },
    //         week4: { days: [2, 7, 4, 0, 9, 5, 6], total: 42 },
    //       },
    //     },
    //     'c80edb24-252d-41e4-b9e6-ca437d0d8f30': {
    //       Jan: {
    //         total: 190,
    //         week1: { days: [4, 8, 1, 6, 2, 7, 3], total: 45 },
    //         week2: { days: [5, 0, 9, 3, 7, 4, 8], total: 47 },
    //         week3: { days: [2, 6, 3, 9, 1, 5, 7], total: 46 },
    //         week4: { days: [8, 4, 0, 7, 2, 6, 1], total: 43 },
    //       },
    //       Feb: {
    //         total: 175,
    //         week1: { days: [3, 7, 2, 8, 4, 9, 1], total: 44 },
    //         week2: { days: [6, 1, 5, 0, 7, 3, 9], total: 42 },
    //         week3: { days: [4, 8, 1, 6, 2, 5, 7], total: 48 },
    //         week4: { days: [9, 2, 6, 3, 8, 4, 0], total: 41 },
    //       },
    //       March: {
    //         total: 185,
    //         week1: { days: [1, 5, 8, 2, 7, 3, 6], total: 47 },
    //         week2: { days: [4, 9, 0, 7, 2, 6, 1], total: 43 },
    //         week3: { days: [3, 7, 4, 8, 1, 5, 9], total: 46 },
    //         week4: { days: [6, 2, 5, 0, 9, 4, 7], total: 42 },
    //       },
    //     },
    //     'cf9a761e-1483-4f2b-89e1-ece3438b6598': {
    //       Jan: {
    //         total: 190,
    //         week1: { days: [4, 8, 1, 6, 2, 7, 3], total: 45 },
    //         week2: { days: [5, 0, 9, 3, 7, 4, 8], total: 47 },
    //         week3: { days: [2, 6, 3, 9, 1, 5, 7], total: 46 },
    //         week4: { days: [8, 4, 0, 7, 2, 6, 1], total: 43 },
    //       },
    //       Feb: {
    //         total: 175,
    //         week1: { days: [3, 7, 2, 8, 4, 9, 1], total: 44 },
    //         week2: { days: [6, 1, 5, 0, 7, 3, 9], total: 42 },
    //         week3: { days: [4, 8, 1, 6, 2, 5, 7], total: 48 },
    //         week4: { days: [9, 2, 6, 3, 8, 4, 0], total: 41 },
    //       },
    //       March: {
    //         total: 185,
    //         week1: { days: [1, 5, 8, 2, 7, 3, 6], total: 47 },
    //         week2: { days: [4, 9, 0, 7, 2, 6, 1], total: 43 },
    //         week3: { days: [3, 7, 4, 8, 1, 5, 9], total: 46 },
    //         week4: { days: [6, 2, 5, 0, 9, 4, 7], total: 42 },
    //       },
    //     },
    //   },
    //   students: {
    //     '6d2defe0-8d3b-4a16-b1e5-539974333bed': {
    //       Jan: {
    //         total: 180,
    //         week1: { days: [3, 7, 2, 8, 1, 4, 6], total: 42 },
    //         week2: { days: [5, 0, 9, 2, 7, 3, 1], total: 37 },
    //         week3: { days: [6, 2, 4, 8, 0, 5, 7], total: 48 },
    //         week4: { days: [1, 3, 7, 9, 2, 6, 4], total: 39 },
    //       },
    //       Feb: {
    //         total: 165,
    //         week1: { days: [4, 8, 1, 5, 7, 2, 0], total: 45 },
    //         week2: { days: [2, 6, 3, 9, 4, 1, 7], total: 41 },
    //         week3: { days: [7, 1, 5, 8, 3, 6, 2], total: 50 },
    //         week4: { days: [0, 4, 6, 2, 9, 5, 8], total: 38 },
    //       },
    //       March: {
    //         total: 192,
    //         week1: { days: [9, 3, 7, 1, 4, 8, 2], total: 47 },
    //         week2: { days: [5, 2, 6, 0, 7, 3, 9], total: 43 },
    //         week3: { days: [8, 4, 1, 6, 2, 5, 7], total: 49 },
    //         week4: { days: [3, 7, 0, 9, 4, 8, 1], total: 44 },
    //       },
    //     },
    //     '24e589dd-8b90-4e51-bf75-0ff90ea544dc': {
    //       Jan: {
    //         total: 178,
    //         week1: { days: [2, 5, 8, 1, 7, 3, 6], total: 40 },
    //         week2: { days: [4, 9, 2, 7, 0, 5, 8], total: 46 },
    //         week3: { days: [6, 1, 4, 9, 3, 7, 2], total: 39 },
    //         week4: { days: [0, 8, 5, 2, 6, 4, 1], total: 43 },
    //       },
    //       Feb: {
    //         total: 190,
    //         week1: { days: [7, 3, 6, 0, 9, 2, 5], total: 48 },
    //         week2: { days: [1, 4, 8, 3, 7, 6, 2], total: 44 },
    //         week3: { days: [5, 2, 9, 4, 8, 1, 7], total: 47 },
    //         week4: { days: [3, 6, 0, 5, 2, 9, 4], total: 41 },
    //       },
    //       March: {
    //         total: 175,
    //         week1: { days: [8, 1, 5, 7, 3, 6, 2], total: 45 },
    //         week2: { days: [4, 9, 2, 6, 0, 7, 3], total: 42 },
    //         week3: { days: [1, 7, 4, 8, 2, 5, 9], total: 46 },
    //         week4: { days: [6, 3, 0, 9, 4, 8, 1], total: 40 },
    //       },
    //     },
    //     'b6416263-ee02-4aef-b4c8-7391aa0452da': {
    //       Jan: {
    //         total: 182,
    //         week1: { days: [3, 6, 1, 8, 4, 7, 2], total: 44 },
    //         week2: { days: [5, 2, 9, 0, 6, 3, 7], total: 41 },
    //         week3: { days: [8, 4, 2, 7, 1, 5, 9], total: 47 },
    //         week4: { days: [0, 7, 3, 6, 2, 8, 4], total: 43 },
    //       },
    //       Feb: {
    //         total: 168,
    //         week1: { days: [9, 1, 5, 3, 7, 2, 6], total: 45 },
    //         week2: { days: [4, 8, 0, 5, 9, 1, 7], total: 42 },
    //         week3: { days: [2, 6, 3, 8, 4, 7, 1], total: 46 },
    //         week4: { days: [7, 0, 4, 9, 2, 5, 8], total: 40 },
    //       },
    //       March: {
    //         total: 195,
    //         week1: { days: [1, 5, 8, 2, 6, 3, 9], total: 47 },
    //         week2: { days: [4, 7, 0, 6, 1, 8, 2], total: 43 },
    //         week3: { days: [3, 9, 4, 7, 2, 5, 8], total: 48 },
    //         week4: { days: [6, 2, 5, 0, 9, 4, 7], total: 41 },
    //       },
    //     },
    //     'b6cc176a-ec2b-4ca1-a510-0bd7addd4b4e': {
    //       Jan: {
    //         total: 176,
    //         week1: { days: [2, 7, 4, 9, 1, 6, 3], total: 42 },
    //         week2: { days: [5, 0, 8, 3, 7, 2, 4], total: 45 },
    //         week3: { days: [6, 1, 5, 8, 0, 9, 2], total: 47 },
    //         week4: { days: [3, 7, 2, 6, 4, 8, 1], total: 43 },
    //       },
    //       Feb: {
    //         total: 185,
    //         week1: { days: [9, 3, 6, 2, 7, 4, 8], total: 46 },
    //         week2: { days: [1, 5, 0, 7, 3, 9, 2], total: 44 },
    //         week3: { days: [4, 8, 1, 6, 2, 5, 7], total: 48 },
    //         week4: { days: [0, 9, 3, 5, 8, 1, 6], total: 41 },
    //       },
    //       March: {
    //         total: 180,
    //         week1: { days: [7, 2, 5, 9, 4, 8, 1], total: 47 },
    //         week2: { days: [3, 6, 0, 8, 2, 7, 4], total: 43 },
    //         week3: { days: [5, 1, 9, 4, 6, 3, 8], total: 45 },
    //         week4: { days: [2, 7, 4, 0, 9, 5, 6], total: 42 },
    //       },
    //     },
    //     '907de304-e1a1-4aab-923c-e599a43739b2': {
    //       Jan: {
    //         total: 190,
    //         week1: { days: [4, 8, 1, 6, 2, 7, 3], total: 45 },
    //         week2: { days: [5, 0, 9, 3, 7, 4, 8], total: 47 },
    //         week3: { days: [2, 6, 3, 9, 1, 5, 7], total: 46 },
    //         week4: { days: [8, 4, 0, 7, 2, 6, 1], total: 43 },
    //       },
    //       Feb: {
    //         total: 175,
    //         week1: { days: [3, 7, 2, 8, 4, 9, 1], total: 44 },
    //         week2: { days: [6, 1, 5, 0, 7, 3, 9], total: 42 },
    //         week3: { days: [4, 8, 1, 6, 2, 5, 7], total: 48 },
    //         week4: { days: [9, 2, 6, 3, 8, 4, 0], total: 41 },
    //       },
    //       March: {
    //         total: 185,
    //         week1: { days: [1, 5, 8, 2, 7, 3, 6], total: 47 },
    //         week2: { days: [4, 9, 0, 7, 2, 6, 1], total: 43 },
    //         week3: { days: [3, 7, 4, 8, 1, 5, 9], total: 46 },
    //         week4: { days: [6, 2, 5, 0, 9, 4, 7], total: 42 },
    //       },
    //     },
    //     '5d6503ad-6b57-4a7e-99bb-2931cc405c98': {
    //       Jan: {
    //         total: 180,
    //         week1: { days: [3, 7, 2, 8, 1, 4, 6], total: 42 },
    //         week2: { days: [5, 0, 9, 2, 7, 3, 1], total: 37 },
    //         week3: { days: [6, 2, 4, 8, 0, 5, 7], total: 48 },
    //         week4: { days: [1, 3, 7, 9, 2, 6, 4], total: 39 },
    //       },
    //       Feb: {
    //         total: 165,
    //         week1: { days: [4, 8, 1, 5, 7, 2, 0], total: 45 },
    //         week2: { days: [2, 6, 3, 9, 4, 1, 7], total: 41 },
    //         week3: { days: [7, 1, 5, 8, 3, 6, 2], total: 50 },
    //         week4: { days: [0, 4, 6, 2, 9, 5, 8], total: 38 },
    //       },
    //       March: {
    //         total: 192,
    //         week1: { days: [9, 3, 7, 1, 4, 8, 2], total: 47 },
    //         week2: { days: [5, 2, 6, 0, 7, 3, 9], total: 43 },
    //         week3: { days: [8, 4, 1, 6, 2, 5, 7], total: 49 },
    //         week4: { days: [3, 7, 0, 9, 4, 8, 1], total: 44 },
    //       },
    //     },
    //   },
    // };

    // setSessionData(session);

    // let assignment: any = "await getData(`${'call  Assignment api '}`)";
    // assignment = {
    //   subject_categories: {
    //     5: {
    //       low: 23,
    //       medium: 30,
    //       high: 20,
    //       very_high: 10,
    //     },
    //     6: {
    //       low: 27,
    //       medium: 20,
    //       high: 30,
    //       very_high: 20,
    //     },
    //     7: {
    //       low: 10,
    //       medium: 50,
    //       high: 20,
    //       very_high: 9,
    //     },
    //     9: {
    //       low: 23,
    //       medium: 30,
    //       high: 10,
    //       very_high: 5,
    //     },
    //     16: {
    //       low: 27,
    //       medium: 30,
    //       high: 8,
    //       very_high: 20,
    //     },
    //   },
    // };
    // setAssignmentData(assignment);

    // let users: any = "await getData(`${'call student  users active  api '}`)";
    // users = {
    //   less_active: {
    //     Jan: {
    //       weeks: [45, 56, 23, 45, 56],
    //     },
    //     Feb: {
    //       weeks: [45, 56, 23, 45, 56],
    //     },
    //     March: {
    //       weeks: [55, 30, 63, 35, 86],
    //     },
    //   },
    //   more_active: {
    //     Jan: {
    //       weeks: [30, 20, 44, 70, 56],
    //     },
    //     Feb: {
    //       weeks: [45, 56, 23, 45, 56],
    //     },
    //     March: {
    //       weeks: [55, 30, 63, 35, 86],
    //     },
    //   },
    // };
    // setUserData(users);

    console.log({
      setSessionData,
      setUserData,
      setAssignmentData,
    });

    fetchData();
  }, []);

  useEffect(() => {
    if (institute?.entity_type === 'college') {
      if (selectedCourse && selectedSemester) {
        const filtered: any = subjectAll.filter(
          (subject) =>
            subject.course_id === selectedCourse &&
            subject.semester_id.toString() === selectedSemester,
        );
        setFilteredSubjects(filtered);
      } else if (selectedCourse) {
        const filtered: any = subjectAll.filter(
          (subject) => subject.course_id === selectedCourse,
        );
        setFilteredSubjects(filtered);
      } else {
        setFilteredSubjects([]);
      }
    } else {
      if (selectedClass) {
        const filtered: any = schoolSubjectAll.filter(
          (subject: any) => subject.class_id === selectedClass,
        );

        setFilteredSubjects(filtered);
      } else {
        setFilteredSubjects([]);
      }
    }
  }, [selectedCourse, selectedSemester, institute, selectedClass]);

  useEffect(() => {
    setSelectedSemester('');
  }, [selectedCourse]);

  useEffect(() => {
    if (user_uuid) {
      getData(`${INSTITUTEURL}/${user_uuid}`).then((data) => {
        setInstitute(data?.data);
      });
    }

    getData(`${STUDENTURL}`).then((data) => {
      setStudentAll(data?.data);
    });
    getData(`${TEACHERURL}`).then((data) => {
      setTeacherAll(data?.data);
    });
    getData(`${SUBJECTURL}`).then((data) => {
      const filteredSub = data?.data?.subjects_data.filter(
        (sub: any) => sub.institution_id == institute_id,
      );

      setSubjectAll(filteredSub);

      const uniqueCourses: any = Object.values(
        filteredSub.reduce(
          (acc: any, item: any) => {
            if (!acc[item.course_id]) {
              acc[item.course_id] = {
                course_id: item.course_id,
                course_name: item.course_name,
              };
            }
            return acc;
          },
          {} as Record<number, { course_id: number; course_name: string }>,
        ),
      );
      setSelectedCourse(uniqueCourses[0]?.course_id);
      const uniqueSemesters = Object.values(
        filteredSub.reduce(
          (acc: any, item: any) => {
            if (!acc[item.semester_id]) {
              acc[item.semester_id] = {
                semester_id: item.semester_id,
                course_id: item.course_id,
                semester_number: item.semester_number,
              };
            }
            return acc;
          },
          {} as Record<
            number,
            { semester_id: number; semester_number: number }
          >,
        ),
      );

      setSemesterAll(uniqueSemesters);

      const uniqueClasses: any = Object.values(
        filteredSub.reduce(
          (acc: any, item: any) => {
            if (!acc[item.class_id]) {
              acc[item.class_id] = {
                class_id: item.class_id,
                class_name: item.class_name,
              };
            }
            return acc;
          },
          {} as Record<number, { course_id: number; course_name: string }>,
        ),
      );
      setSelectedClass(uniqueClasses[0]?.class_id);
    });
    getData(`${SUBJECT_SCHOOL_URL}`).then((data) => {
      setschoolSubjectAll(data?.data?.subjects_data);
    });
  }, []);

  useEffect(() => {
    if (
      !sessionData ||
      !assignmentData.subject_categories ||
      !sessionData.teachers
    )
      return;

    if (sessionData.teachers) {
      const teacherActivity = Object.entries(sessionData.teachers).map(
        ([id, data]: any) => {
          const monthData = data[activeMonth] || {};
          return {
            id,
            total: monthData.total || 0,
          };
        },
      );

      const topTeachers = teacherActivity
        .sort((a, b) => b.total - a.total)
        .slice(0, 20);

      setTopUsers((prev: any) => ({
        ...prev,
        teachers: topTeachers,
      }));
    }

    if (sessionData.students) {
      const studentActivity = Object.entries(sessionData.students).map(
        ([id, data]: any) => {
          const monthData = data[activeMonth] || {};
          return {
            id,
            total: monthData.total || 0,
          };
        },
      );

      const topStudents = studentActivity
        .sort((a, b) => b.total - a.total)
        .slice(0, 100);

      setTopUsers((prev: any) => ({
        ...prev,
        students: topStudents,
      }));
    }

    setSubjectData(assignmentData.subject_categories);
  }, [sessionData, assignmentData, activeMonth]);

  const getMonths = () => {
    if (!sessionData || !sessionData.teachers) return [];

    const firstTeacher = Object.values(sessionData.teachers)[0];

    return Object.keys(firstTeacher || {});
  };

  const transformData = (sourceData: any, userType: any) => {
    if (!sessionData || !sourceData) return { series: [], categories: [] };

    let series = [];
    let categories: any = [];
    let name = '';

    if (activeTab === 'weekly') {
      const firstUserData = (
        Object.values(sourceData)[0] as Record<string, any>
      )?.[activeMonth];

      if (!firstUserData) return { series: [], categories: [] };

      const weekKeys = Object.keys(firstUserData).filter((key) =>
        key.startsWith('week'),
      );

      categories = weekKeys.map((week) => `Week ${week.replace('week', '')}`);

      const displayLimit = userType === 'teachers' ? 20 : 25;

      series = topUsers[userType].slice(0, displayLimit).map((user: any) => {
        const userData = sourceData[user.id]?.[activeMonth];

        if (!userData)
          return {
            name: user.id,
            data: Array(weekKeys.length).fill(0),
          };

        if (userType === 'teachers') {
          const currentTeacher: any = teacherAll.filter(
            (teacher) => teacher.id == user.id,
          );

          name =
            currentTeacher[0]?.first_name + ' ' + currentTeacher[0]?.last_name;
        } else if (userType === 'students') {
          const current_student = studentAll.filter(
            (student) => student.id == user.id,
          );

          name =
            current_student[0]?.first_name +
            ' ' +
            current_student[0]?.last_name;
        }

        return {
          name: name,
          data: weekKeys.map((week) => userData[week]?.total || 0),
        };
      });
    } else if (activeTab === 'monthly') {
      const allMonths = getMonths();
      categories = allMonths.map((month) => month);

      const displayLimit = userType === 'teachers' ? 20 : 25;

      series = topUsers[userType].slice(0, displayLimit).map((user: any) => {
        const userData = sourceData[user.id];
        if (!userData)
          return {
            name: user.id,
            data: Array(allMonths.length).fill(0),
          };

        if (userType === 'teachers') {
          const currentTeacher: any = teacherAll.filter(
            (teacher) => teacher.id == user.id,
          );

          name =
            currentTeacher[0]?.first_name + ' ' + currentTeacher[0]?.last_name;
        } else if (userType === 'students') {
          const current_student = studentAll.filter(
            (student) => student.id == user.id,
          );

          name =
            current_student[0]?.first_name +
            ' ' +
            current_student[0]?.last_name;
        }

        return {
          name: name,
          data: allMonths.map((month) => userData[month]?.total || 0),
        };
      });
    }

    return { series, categories };
  };

  const renderSubjectPerformanceChart = (subjectData: any) => {
    if (!subjectData || Object.keys(subjectData).length === 0) {
      return <div className="chart-placeholder">No subject data available</div>;
    }

    const categories = Object.keys(subjectData);
    const series = [
      {
        name: 'Low (0-25%)',
        data: categories.map((subject) => subjectData[subject].low || 0),
      },
      {
        name: 'Medium (26-50%)',
        data: categories.map((subject) => subjectData[subject].medium || 0),
      },
      {
        name: 'High (51-80%)',
        data: categories.map((subject) => subjectData[subject].high || 0),
      },
      {
        name: 'Very High (81-100%)',
        data: categories.map((subject) => subjectData[subject].very_high || 0),
      },
    ];

    const options: ApexOptions = {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          columnWidth: '20%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 0.2,
        colors: ['#fff'],
      },
      title: {
        text: 'Student Performance by Subject',
        align: 'center',
        style: { fontSize: '18px', fontWeight: '600', color: '#333' },
      },
      xaxis: {
        categories,
        labels: {
          rotate: -45,
          rotateAlways: false,
          style: { fontSize: '12px', fontWeight: '500' },
          formatter: function (value) {
            return typeof value === 'string' && value.length > 15
              ? value.substring(0, 15) + '...'
              : value;
          },
        },
      },
      yaxis: {
        title: {
          text: 'Number of Students',
          style: { fontSize: '14px', fontWeight: '600', color: '#444' },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ' students';
          },
        },
      },
      fill: {
        opacity: 0.9,
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '13px',
        fontWeight: '500',
      },
      colors: ['#5B8FF9', '#FFC75F', '#F85C70', '#4ADE80'],
    };

    return (
      <div className="subject-performance">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </div>
    );
  };

  const renderStudentActivityChart = () => {
    if (!sessionData || !sessionData.students) {
      return <div className="chart-placeholder">No student data available</div>;
    }

    if (activeTab === 'daily') {
      const calendarData = transformDailyDataToHeatmap(
        sessionData.students,
        activeMonth,
        'student',
      );

      if (!calendarData || calendarData.length === 0) {
        return (
          <div className="chart-placeholder">No data for selected view</div>
        );
      }

      const options: ApexOptions = {
        chart: {
          type: 'heatmap',
          height: 350,
          toolbar: {
            show: false,
          },
        },
        title: {
          text: 'Student Daily Activity (Top 5 + Average)',
          align: 'center',
          style: { fontSize: '18px' },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ['#008FFB'],
        xaxis: {
          type: 'category',
          labels: {
            rotate: -45,
            rotateAlways: false,
          },
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val + ' Hours';
            },
          },
        },
        plotOptions: {
          heatmap: {
            colorScale: {
              ranges: [
                {
                  from: 0,
                  to: 2,
                  color: '#e0f7fa',
                  name: 'Low',
                },
                {
                  from: 3,
                  to: 5,
                  color: '#4dd0e1',
                  name: 'Medium',
                },
                {
                  from: 6,
                  to: 8,
                  color: '#0097a7',
                  name: 'High',
                },
                {
                  from: 9,
                  to: 10,
                  color: '#006064',
                  name: 'Very High',
                },
              ],
            },
          },
        },
      };

      return (
        <div className="student-activity">
          <ReactApexChart
            key={`student-heatmap-${activeTab}`}
            options={options}
            series={calendarData}
            type="heatmap"
            height={350}
          />
        </div>
      );
    } else {
      const { series, categories } = transformDataTop5PlusAverage(
        sessionData.students,
        'students',
      );

      if (series.length === 0) {
        return (
          <div className="chart-placeholder">No data for selected view</div>
        );
      }

      const options: ApexOptions = {
        chart: {
          type: 'area',
          height: 350,
          stacked: false,
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        title: {
          text: `Student Activity (${activeTab}) - Top 3 + Average`,
          align: 'center',
          style: { fontSize: '18px' },
        },
        xaxis: {
          categories,
          labels: {
            rotate: -45,
            rotateAlways: false,
          },
        },
        yaxis: {
          title: {
            text: 'Activity Hours',
          },
        },
        grid: {
          show: true,
          borderColor: '#e0e0e0',
          strokeDashArray: 5,
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
        },
        stroke: {
          width: 2,
          curve: 'smooth',
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.3,
          },
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val + ' Hours';
            },
          },
        },
        colors: [
          '#008FFB',
          '#00E396',
          '#FEB019',
          '#FF4560',
          '#775DD0',
          '#546E7A',
        ],
      };

      return (
        <div className="student-activity">
          <ReactApexChart
            key={`student-area-${activeTab}-${JSON.stringify(categories)}`}
            options={options}
            series={series}
            type="area"
            height={350}
          />
        </div>
      );
    }
  };

  const transformDataTop5PlusAverage = (students: any, userType: string) => {
    const categories: any = [];
    const allStudentData: any = {};
    let name = '';

    Object.keys(students).forEach((studentId) => {
      allStudentData[studentId] = [];

      if (activeTab === 'weekly') {
        for (let i = 1; i <= 4; i++) {
          const weekKey = `week${i}`;
          if (students[studentId][activeMonth][weekKey]) {
            if (!categories.includes(weekKey)) {
              categories.push(weekKey);
            }

            allStudentData[studentId].push({
              category: weekKey,
              value: students[studentId][activeMonth][weekKey].total,
            });
          }
        }
      } else {
        Object.keys(students[studentId]).forEach((month) => {
          if (!categories.includes(month)) {
            categories.push(month);
          }
          allStudentData[studentId].push({
            category: month,
            value: students[studentId][month].total,
          });
        });
      }
    });

    const studentTotals: any = {};
    Object.keys(allStudentData).forEach((studentId: any) => {
      studentTotals[studentId] = allStudentData[studentId].reduce(
        (sum: any, item: any) => sum + item.value,
        0,
      );
    });

    const top5Students = Object.keys(studentTotals)
      .sort((a, b) => studentTotals[b] - studentTotals[a])
      .slice(0, 3);

    categories.sort();

    const series = top5Students.map((studentId) => {
      const data = categories.map((category: any) => {
        const item = allStudentData[studentId].find(
          (d: any) => d.category === category,
        );
        return item ? item.value : 0;
      });

      if (userType === 'teachers') {
        const currentTeacher: any = teacherAll.filter(
          (teacher) => teacher.id == studentId,
        );

        name =
          currentTeacher[0]?.first_name + ' ' + currentTeacher[0]?.last_name;
      } else if (userType === 'students') {
        const current_student = studentAll.filter(
          (student) => student.id == studentId,
        );

        name =
          current_student[0]?.first_name + ' ' + current_student[0]?.last_name;
      }

      return {
        name: name,
        data,
      };
    });

    const averageData = categories.map((category: any) => {
      let sum = 0;
      let count = 0;

      Object.keys(allStudentData).forEach((studentId) => {
        const item = allStudentData[studentId].find(
          (d: any) => d.category === category,
        );
        if (item) {
          sum += item.value;
          count++;
        }
      });

      return count > 0 ? Math.round(sum / count) : 0;
    });

    series.push({
      name: 'Average',
      data: averageData,
    });

    return { series, categories };
  };

  const transformDailyDataToHeatmap = (
    users: any,
    activeMonth: string,
    userType: string,
  ) => {
    const userTotals: any = {};
    Object.keys(users).forEach((userId) => {
      userTotals[userId] = 0;
      if (users[userId][activeMonth]) {
        userTotals[userId] = users[userId][activeMonth].total || 0;
      }
    });

    const top5Users = Object.keys(userTotals)
      .sort((a, b) => userTotals[b] - userTotals[a])
      .slice(0, 5);

    const series = top5Users.map((userId) => {
      let name = `${userId}`;
      const data: any = [];

      const dayMap: Record<number, number> = {};
      for (let i = 1; i <= 31; i++) {
        dayMap[i] = 0;
      }

      if (users[userId][activeMonth]) {
        Object.keys(users[userId][activeMonth]).forEach((week) => {
          if (week.startsWith('week')) {
            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
              const day =
                dayIndex + 1 + (parseInt(week.replace('week', '')) - 1) * 7;
              if (day <= 31) {
                dayMap[day] +=
                  users[userId][activeMonth][week].days[dayIndex] || 0;
              }
            }
          }
        });
      }

      Object.keys(dayMap).forEach((day) => {
        data.push({ x: `${day}`, y: dayMap[parseInt(day)] });
      });

      if (userType === 'teacher') {
        const currentTeacher: any = teacherAll.filter(
          (teacher) => teacher.id == name,
        );

        name =
          currentTeacher[0]?.first_name + ' ' + currentTeacher[0]?.last_name;
      } else if (userType === 'student') {
        const current_student = studentAll.filter(
          (student) => student.id == name,
        );

        name =
          current_student[0]?.first_name + ' ' + current_student[0]?.last_name;
      }
      return { name, data };
    });

    const allDayData: Record<number, { sum: number; count: number }> = {};
    for (let i = 1; i <= 31; i++) {
      allDayData[i] = { sum: 0, count: 0 };
    }

    Object.keys(users).forEach((userId) => {
      if (users[userId][activeMonth]) {
        Object.keys(users[userId][activeMonth]).forEach((week) => {
          if (week.startsWith('week')) {
            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
              const day =
                dayIndex + 1 + (parseInt(week.replace('week', '')) - 1) * 7;
              if (day <= 31) {
                allDayData[day].sum +=
                  users[userId][activeMonth][week].days[dayIndex] || 0;
                allDayData[day].count++;
              }
            }
          }
        });
      }
    });

    const averageData = Object.keys(allDayData).map((day) => ({
      x: `Day ${day}`,
      y:
        allDayData[parseInt(day)].count > 0
          ? Math.round(
              allDayData[parseInt(day)].sum / allDayData[parseInt(day)].count,
            )
          : 0,
    }));

    series.push({
      name: 'Average',
      data: averageData,
    });

    return series;
  };

  const renderTeacherActivityChart = () => {
    if (!sessionData || !sessionData.teachers) {
      return <div className="chart-placeholder">No teacher data available</div>;
    }

    if (activeTab === 'daily') {
      const calendarData = transformDailyDataToHeatmap(
        sessionData.teachers,
        activeMonth,
        'teacher',
      );

      if (!calendarData || calendarData.length === 0) {
        return (
          <div className="chart-placeholder">No data for selected view</div>
        );
      }

      const options: ApexOptions = {
        chart: {
          type: 'heatmap',
          height: 350,
          toolbar: {
            show: false,
          },
        },
        title: {
          text: 'Teachers Daily Activity',
          align: 'center',
          style: { fontSize: '18px' },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ['#008FFB'],
        xaxis: {
          type: 'category',
          labels: {
            rotate: -45,
            rotateAlways: false,
          },
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val + ' Hours';
            },
          },
        },
        plotOptions: {
          heatmap: {
            colorScale: {
              ranges: [
                {
                  from: 0,
                  to: 2,
                  color: '#e0f7fa',
                  name: 'Low',
                },
                {
                  from: 3,
                  to: 5,
                  color: '#4dd0e1',
                  name: 'Medium',
                },
                {
                  from: 6,
                  to: 8,
                  color: '#0097a7',
                  name: 'High',
                },
                {
                  from: 9,
                  to: 10,
                  color: '#006064',
                  name: 'Very High',
                },
              ],
            },
          },
        },
      };

      return (
        <div className="teacher-activity">
          <ReactApexChart
            key={`teacher-pie-${activeTab}-${JSON.stringify(calendarData)}`}
            options={options}
            series={calendarData}
            type="heatmap"
            height={350}
          />
        </div>
      );
    } else {
      const { series, categories } = transformData(
        sessionData.teachers,
        'teachers',
      );

      if (series.length === 0) {
        return (
          <div className="chart-placeholder">No data for selected view</div>
        );
      }

      const options: ApexOptions = {
        chart: {
          type: 'bar',
          height: 350,
          stacked: false,
          toolbar: {
            show: false,
          },
        },
        grid: { show: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 6,
            columnWidth: '55%',
            borderRadiusApplication: 'end',
          },
        },
        dataLabels: {
          enabled: false,
        },
        title: {
          text: `Teacher Activity (${activeTab})`,
          align: 'center',
          style: { fontSize: '18px' },
        },
        xaxis: {
          categories,
          labels: {
            rotate: -45,
            rotateAlways: false,
          },
        },
        yaxis: {
          title: {
            text: 'Activity Level',
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val + ' Hours';
            },
          },
        },
      };

      return (
        <div className="teacher-activity">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      );
    }
  };

  const renderUserFrequencyChart = () => {
    if (!userData || !userData.less_active || !userData.more_active) {
      return (
        <div className="chart-placeholder">No frequency data available</div>
      );
    }

    const lessActiveData = userData.less_active[activeMonth]?.weeks || [];
    const moreActiveData = userData.more_active[activeMonth]?.weeks || [];

    if (!lessActiveData.length || !moreActiveData.length) {
      return (
        <div className="chart-placeholder">No data for selected month</div>
      );
    }

    const series = [
      {
        name: 'Less Active Users',
        data: lessActiveData,
      },
      {
        name: 'Frequent Users',
        data: moreActiveData,
      },
    ];

    const options: ApexOptions = {
      chart: {
        type: 'area',
        height: 350,

        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          speed: 800,
        },
      },

      stroke: {
        curve: 'smooth',
        width: 3,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100],
        },
      },
      title: {
        text: 'User Activity',
        align: 'center',
        style: {
          fontSize: '18px',
        },
      },
      grid: {
        show: false,
      },
      markers: {
        size: 6,
      },
      xaxis: {
        categories: lessActiveData.map((_: any, i: any) => `Week ${i + 1}`),
      },
      yaxis: {
        title: {
          text: 'Number of Users',
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
      },
      colors: ['#FEB019', '#FF4560'],
    };

    return (
      <div className="user-frequency">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </div>
    );
  };

  const transformedSubjectData = useMemo(() => {
    if (!filteredSubjects.length) return {};

    const result: any = {};

    filteredSubjects.forEach((subject: any) => {
      const subjectPerformance = subjectData[subject.subject_id];

      if (subjectPerformance) {
        result[subject.subject_name] = {
          low: subjectPerformance.low || 0,
          medium: subjectPerformance.medium || 0,
          high: subjectPerformance.high || 0,
          very_high: subjectPerformance.very_high || 0,
        };
      }
    });

    return result;
  }, [filteredSubjects]);

  return (
    <div className="institution-charts">
      <div className="controls">
        <div className="control-group">
          <label>Month:</label>
          <select
            value={activeMonth}
            onChange={(e) => setActiveMonth(e.target.value)}
          >
            {getMonths().map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
              onClick={() => setActiveTab('daily')}
            >
              Daily
            </button>
            <button
              className={`tab ${activeTab === 'weekly' ? 'active' : ''}`}
              onClick={() => setActiveTab('weekly')}
            >
              Weekly
            </button>
            <button
              className={`tab ${activeTab === 'monthly' ? 'active' : ''}`}
              onClick={() => setActiveTab('monthly')}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>
      <div className="">
        <div className="chart-box full-width">
          {renderStudentActivityChart()}
        </div>
        <div className="chart-box full-width mt-4">
          {renderTeacherActivityChart()}
        </div>
        <div className="chart-box full-width mt-4">
          {renderUserFrequencyChart()}
        </div>

        <div className="subject-performance-container  mt-4">
          {institute?.entity_type === 'college' && (
            <div
              className="filters-container"
              style={{ marginBottom: '20px', display: 'flex', gap: '16px' }}
            >
              <FormControl
                fullWidth
                variant="outlined"
                style={{ minWidth: '200px' }}
              >
                <InputLabel id="course-select-label">Course</InputLabel>
                <Select
                  labelId="course-select-label"
                  id="course-select"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  label="Course"
                >
                  {uniqueCourses.map((course) => (
                    <MenuItem key={course.course_id} value={course.course_id}>
                      {course.course_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                variant="outlined"
                style={{ minWidth: '200px' }}
              >
                <InputLabel id="semester-select-label">Semester</InputLabel>
                <Select
                  labelId="semester-select-label"
                  id="semester-select"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  label="Semester"
                  disabled={!selectedCourse}
                >
                  <MenuItem value="">All Semesters</MenuItem>
                  {filteredSemesters.map((semester) => (
                    <MenuItem
                      key={semester.semester_id}
                      value={semester.semester_id.toString()}
                    >
                      Semester {semester.semester_number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
          {institute?.entity_type === 'school' && (
            <div
              className="filters-container"
              style={{ marginBottom: '20px', display: 'flex', gap: '16px' }}
            >
              <FormControl variant="outlined" style={{ minWidth: '200px' }}>
                <InputLabel id="course-select-label">Class</InputLabel>
                <Select
                  labelId="course-select-label"
                  id="course-select"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  label="Course"
                >
                  {uniqueClasses.map((cls: any) => (
                    <MenuItem key={cls.class_id} value={cls.class_id}>
                      {cls.class_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
          <div className="chart-box full-width mt-4">
            {renderSubjectPerformanceChart(transformedSubjectData)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionCharts;
