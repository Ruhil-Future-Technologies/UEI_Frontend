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

  const [activeMonth, setActiveMonth] = useState('');
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
    getData(`/session/stats-for-institute/${institute_id}`).then((response) => {
      const sessionData = response.data;

      const monthMapping: any = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December',
      };

      const modifiedData: any = {
        students: {},
        teachers: {},
      };

      Object.keys(sessionData.students || {}).forEach((studentId) => {
        modifiedData.students[studentId] = {};

        Object.keys(sessionData.students[studentId]).forEach((monthNum) => {
          const monthName = monthMapping[monthNum] || monthNum;
          modifiedData.students[studentId][monthName] =
            sessionData.students[studentId][monthNum];
        });
      });

      Object.keys(sessionData.teachers || {}).forEach((teacherId) => {
        modifiedData.teachers[teacherId] = {};

        Object.keys(sessionData.teachers[teacherId]).forEach((monthNum) => {
          const monthName = monthMapping[monthNum] || monthNum;
          modifiedData.teachers[teacherId][monthName] =
            sessionData.teachers[teacherId][monthNum];
        });
      });

      const allMonthNumbers: number[] = [];

      const collectMonths = (data: any) => {
        Object.values(data || {}).forEach((months: any) => {
          allMonthNumbers.push(...Object.keys(months).map(Number));
        });
      };

      collectMonths(sessionData.students);
      collectMonths(sessionData.teachers);

      if (allMonthNumbers.length > 0) {
        const minMonth = Math.min(...allMonthNumbers);
        setActiveMonth(monthMapping[minMonth]);
      }

      const session = modifiedData;
      setSessionData(session);
    });

    getData(`/assignment/stats-for-institute/${institute_id}`).then(
      (response) => {
        const assignment = response.data;

        setAssignmentData(assignment);
      },
    );

    getData(`/session/institute_student_activity/${institute_id}`).then(
      (response) => {
        const users = response.data;

        if (users && users.less_active && users.more_active) {
          const lessActiveMonth: any = Object.keys(users?.less_active)[0];
          const moreActiveMonth: any = Object.keys(users?.more_active)[0];

          users.less_active[lessActiveMonth].weeks = users.less_active[
            lessActiveMonth
          ].weeks.map((v: any) => Math.round(v));
          users.more_active[moreActiveMonth].weeks = users.more_active[
            moreActiveMonth
          ].weeks.map((v: any) => Math.round(v));
        }

        setUserData(users);
      },
    );

    fetchData();
  }, [institute_id]);

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
    if (selectedCourse && selectedSemester) {
      const semestersForCourse = semesterAll.filter(
        (semester) => semester.course_id === selectedCourse,
      );

      if (semestersForCourse.length > 0) {
        setSelectedSemester(semestersForCourse[0]?.semester_id.toString());
      } else {
        setSelectedSemester('');
      }
    }
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
      const uniqueSemesters: any = Object.values(
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
      setSelectedSemester(uniqueSemesters[0]?.semester_id.toString());

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
  }, [institute_id, user_uuid]);

  useEffect(() => {
    if (!sessionData || !assignmentData || !sessionData.teachers) return;

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

    setSubjectData(assignmentData);
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
          borderRadius: 8,
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
          style: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#444',
          },
        },
        tickAmount: 5,
        forceNiceScale: true,
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
            if (!categories?.includes(weekKey)) {
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
        labels: {
          formatter: (val: number) => Math.round(val).toString(),
        },
        tickAmount: 6,
        forceNiceScale: true,
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
      const subjectPerformance = subjectData[subject.subject_name];

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
              <FormControl variant="outlined" style={{ minWidth: '200px' }}>
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

              <FormControl variant="outlined" style={{ minWidth: '200px' }}>
                <InputLabel id="semester-select-label">Semester</InputLabel>
                <Select
                  labelId="semester-select-label"
                  id="semester-select"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  label="Semester"
                  disabled={!selectedCourse}
                >
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
