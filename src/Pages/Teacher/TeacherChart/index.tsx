/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import './TeacherDashboardCharts.scss';
import useApi from '../../../hooks/useAPI';
import {
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL,
  QUERY_KEYS_TEACHER,
} from '../../../utils/const';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TeacherDashboardCharts = () => {
  const { getData } = useApi();

  const TEACHERURL = QUERY_KEYS_TEACHER.TEACHER_EDIT;
  const SUBJECTURL = QUERY_KEYS_SUBJECT.GET_SUBJECT;
  const SUBJECT_SCHOOL_URL = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT;

  const [selectedClass, setSelectedClass] = useState('');
  const [subjectAll, setSubjectAll] = useState<any[]>([]);
  const [schoolSubjectAll, setschoolSubjectAll] = useState<any>([]);
  const [semesterAll, setSemesterAll] = useState<any[]>([]);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState<any>([]);
  const [teacherDataStatus, setTeacherDataStatus] = useState(false);
  const [courseDataStatus, setCourseDataStatus] = useState(false);
  const [dataStatus, setDataStatus] = useState(false);

  const [data, setData] = useState<any>({});

  const user_uuid = localStorage.getItem('user_uuid');
  const teacher_id = localStorage.getItem('teacher_id') || '';
  const [teacher, setTeacher] = useState<any>([]);

  const uniqueCourses = [
    ...new Set(subjectAll?.map((item) => item.course_id)),
  ].map((courseId) => {
    return {
      course_id: courseId,
      course_name: subjectAll?.find((item) => item.course_id === courseId)
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
    return semesterAll?.filter(
      (semester) => semester.course_id === selectedCourse,
    );
  }, [selectedCourse]);

  useEffect(() => {
    if (user_uuid) {
      getData(`${TEACHERURL}/${user_uuid}`).then((data) => {
        setTeacher(data?.data);
        setTeacherDataStatus(true);
      });
    }
  }, []);

  useEffect(() => {
    if (teacherDataStatus) {
      if (teacher?.entity_type === 'college') {
        if (courseDataStatus) {
          if (selectedCourse && selectedSemester) {
            const filtered: any = subjectAll?.filter(
              (subject) =>
                subject.course_id === selectedCourse &&
                subject.semester_id.toString() === selectedSemester,
            );

            setFilteredSubjects(filtered);
          } else if (selectedCourse) {
            const filtered: any = subjectAll?.filter(
              (subject) => subject.course_id === selectedCourse,
            );

            setFilteredSubjects(filtered);
          } else {
            setFilteredSubjects([]);
          }
        }
      } else {
        const filtered: any = schoolSubjectAll?.filter(
          (subject: any) => subject.class_id === selectedClass,
        );

        setFilteredSubjects(filtered);
      }
    }
  }, [
    teacherDataStatus,
    teacher,
    selectedCourse,
    selectedSemester,
    selectedClass,
    courseDataStatus,
  ]);

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
    if (teacher_id) {
      getData(`/assignment/stats-for-teacher/${teacher_id}`).then((data) => {
        setData(data?.data);
        setDataStatus(true);
      });
    }
  }, [teacher_id]);

  useEffect(() => {
    if (user_uuid && dataStatus) {
      getData(`${TEACHERURL}/${user_uuid}`).then((data) => {
        let teacherData :any = ""
        if(data.status){
         teacherData = data?.data;
        setTeacher(data?.data);
        }

        getData(`${SUBJECTURL}`).then((data) => {
          const teacher_course = teacherData?.course_semester_subjects;
          const teacherCourseIds = teacher_course
            ? Object.keys(teacher_course).map(Number)
            : [];

          const filteredSub = data?.data?.subjects_data?.filter(
            (sub: any) =>
              sub?.institution_id === teacherData?.institute_id &&
              teacherCourseIds?.includes(sub?.course_id),
          );

          setSubjectAll(filteredSub);

          const uniqueCourses: any = Object?.values(
            (filteredSub ?? []).reduce(
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
              (filteredSub ?? []).reduce(
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

          setCourseDataStatus(true);
        });
        getData(`${SUBJECT_SCHOOL_URL}`).then((data) => {
          if (teacherData && teacherData?.class_stream_subjects) {
            const filterCriteria = Object.entries(
              teacherData?.class_stream_subjects,
            ).flatMap(([classId, streams]: any) =>
              Object.entries(streams).map(([stream, subjects]) => ({
                class_id: Number(classId),
                stream: stream,
                subjects,
              })),
            );

            const filteredSub = data?.data?.subjects_data?.filter(
              ({ class_id, stream, subject_name }: any) =>
                filterCriteria?.some(
                  ({ class_id: id, stream: st, subjects }: any) =>
                    id === class_id &&
                    (st === 'general' || st === stream) &&
                    subjects.includes(subject_name),
                ),
            );

            setschoolSubjectAll(filteredSub);

            const uniqueClasses: any = Object.values(
                (filteredSub ?? []).reduce(
                (acc: any, item: any) => {
                  if (!acc[item.class_id]) {
                    acc[item.class_id] = {
                      class_id: item.class_id,
                      class_name: item.class_name,
                    };
                  }
                  return acc;
                },
                {} as Record<number, { class_id: number; class_name: string }>,
              ),
            );

            setSelectedClass(uniqueClasses[0]?.class_id);
            setCourseDataStatus(true);
          }
        });
      });
    }
  }, [data, dataStatus]);

  const transformedSubjectData = useMemo(() => {
    if (!filteredSubjects.length) return {};

    const result: any = {};
    const performanceChartData: any = {
      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: false,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '40%',
            borderRadius: 10,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [],
          title: {
            text: 'Subjects',
          },
        },
        yaxis: {
          title: {
            text: 'Performance Metrics',
          },
        },
        title: {
          text: 'Subject Performance',
          align: 'center',
        },
      },
      series: [
        {
          name: 'Average Score',
          data: [],
        },
      ],
    };

    const completionChartData: any = {
      options: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '40%',
            borderRadius: 10,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [],
          title: {
            text: 'Subjects',
          },
        },
        yaxis: {
          title: {
            text: 'Assignment Completion',
          },
        },
        title: {
          text: 'Assignment Completion Status',
          align: 'center',
        },
        colors: ['#66C266', '#D9534F'],
      },
      series: [
        {
          name: 'Completed',
          data: [],
        },
        {
          name: 'Pending',
          data: [],
        },
      ],
    };

    filteredSubjects?.forEach((subject: any) => {
      const courseId = subject?.course_id?.toString();
      const subject_name = subject?.subject_name;
      const classId = subject?.class_id?.toString();
      let subjectPerformance = [];

      if (teacher.entity_type === 'college') {
        subjectPerformance = data[courseId]?.[subject_name];
      } else {
        subjectPerformance = data[classId]?.[subject_name];
      }

      if (subjectPerformance) {
        result[subject.subject_name] = subjectPerformance;

        performanceChartData.options.xaxis.categories.push(
          subject.subject_name,
        );
        performanceChartData.series[0].data.push(
          subjectPerformance.average_score,
        );

        completionChartData.options.xaxis.categories.push(subject.subject_name);
        completionChartData.series[0].data.push(subjectPerformance.completed);
        completionChartData.series[1].data.push(
          subjectPerformance.pending_assignments,
        );
      }
    });

    return { performanceChartData, completionChartData };
  }, [filteredSubjects, data]);

  const renderPerformanceData = (transformSubjectData: any) => {
    if (
      !transformSubjectData ||
      !transformSubjectData.performanceChartData?.series
    )
      return (
        <div className="chart-placeholder">
          No Performance subject data available
        </div>
      );

    return (
      <div className="chart-wrapper performance-chart">
        <ReactApexChart
          options={transformSubjectData.performanceChartData.options}
          series={transformSubjectData.performanceChartData.series}
          type="bar"
          height={350}
        />
      </div>
    );
  };

  const renderCompletionData = (transformSubjectData: any) => {
    if (
      !transformSubjectData ||
      !transformSubjectData.completionChartData?.series
    )
      return (
        <div className="chart-placeholder">No Completion data available</div>
      );

    return (
      <div className="chart-wrapper completion-chart">
        <ReactApexChart
          options={transformSubjectData.completionChartData.options}
          series={transformSubjectData.completionChartData.series}
          type="bar"
          height={350}
        />
      </div>
    );
  };

  return (
    <div className="">
      <div className="subject-performance-container  mt-4">
        {teacher?.entity_type === 'college' && (
          <div className="row mb-4 gy-3">
            <div className="col-lg-2">
              <FormControl variant="outlined" className="w-100">
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
            </div>

            <div className="col-lg-2">
              <FormControl variant="outlined" className="w-100">
                <InputLabel id="semester-select-label">Semester</InputLabel>
                <Select
                  labelId="semester-select-label"
                  id="semester-select"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  label="Semester"
                  disabled={!selectedCourse}
                >
                  {filteredSemesters?.map((semester) => (
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
          </div>
        )}
        {teacher?.entity_type === 'school' && (
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
      </div>
      <div className="charts-container mb-4">
        {filteredSubjects?.length > 0 && (
          <>
            {renderPerformanceData(transformedSubjectData)}
            {renderCompletionData(transformedSubjectData)}
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboardCharts;
