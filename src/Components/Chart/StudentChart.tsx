/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useAPI';
import {
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL,
} from '../../utils/const';
import ReactApexChart from 'react-apexcharts';
import {
  createAcademicPerformanceConfig,
  createCompletionRateConfig,
} from './ChartConfig';
import { useTheme } from '../../ThemeProvider';
const StudentDashboardCharts = () => {
  const { isDarkMode } = useTheme();
  const { getData } = useApi();

  const userdata = JSON.parse(localStorage.getItem('userdata') ?? '""');
  const [activeTab, setActiveTab] = useState('weekly');
  const getCurrentMonth = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    return months[new Date().getMonth()];
  };
  const [activeMonth, setActiveMonth] = useState(getCurrentMonth());

  const [academicPerformanceData, setAcademicPerformanceData] = useState<any>({
    series: [],
    options: {
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: [] },
      title: {
        text: 'No Academic Performance Data Available',
        align: 'center',
      },
    },
  });
  const [completionRateData, setCompletionRateData] = useState<any>({
    series: [],
    options: {
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: [] },
      title: {
        text: 'No Assignment Completion Data Available',
        align: 'center',
      },
    },
  });

  const [learningTimeData, setLearningTimeData] = useState<any>({
    series: [],
    options: {
      chart: { height: 400, type: 'line' },
      xaxis: { categories: [] },
      title: { text: 'No Learning Time Data Available', align: 'center' },
      legend: {
        position: 'bottom',
        labels: {
          colors: ['#666666', '#666', '#666'], // Change this to a dark/light color based on theme
        },
      },
    },
  });

  const [studyStreaksData, setStudyStreaksData] = useState<any>({
    series: [],
    options: {
      chart: { height: 400, type: 'line' },
      xaxis: { categories: [] },
      title: { text: 'No Study Streaks Data Available', align: 'center' },
      legend: {
        position: 'bottom',
        labels: {
          colors: ['#666666', '#666', '#666'], // Change this to a dark/light color based on theme
        },
      },
    },
  });
  const [studentData, setStudentData] = useState<any>('');
  const student_id = localStorage.getItem('_id') || '';

  const getMonths = () => {
    if (!studentData) return [];

    const monthSet = new Set<string>();

    const extractMonths = (data: Record<string, Record<string, any>>) => {
      Object.values(data).forEach((monthObj) => {
        Object.keys(monthObj).forEach((month) => monthSet.add(month));
      });
    };

    extractMonths(studentData);

    return Array.from(monthSet);
  };

  useEffect(() => {
    const months = getMonths();
    if (months.length > 0 && activeMonth === getCurrentMonth()) {
      setActiveMonth(months[months.length - 1]);
    }
  }, [studentData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegeData, schoolData]: any = await Promise.all([
          getData(`${QUERY_KEYS_SUBJECT.GET_SUBJECT}`),
          getData(`${QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT}`),
        ]);

        let performanceData: any = [];
        let study_data: any = [];

        if (student_id) {
          getData(`/assignment/stats-for-student/${student_id}`).then(
            (response) => {
              performanceData = response?.data?.subject_stats?.assignments;

              if (userdata?.entity_name === 'college') {
                const subjectMap: any = {};

                collegeData?.data?.subjects_data?.forEach((subject: any) => {
                  subjectMap[subject?.subject_name] = subject?.subject_name;
                });

                const labels: any = [];
                const currentScores: any = [];
                const previousScores: any = [];
                const completedAssignments: any = [];
                const pendingAssignments: any = [];

                Object.entries(performanceData)?.forEach(
                  ([subject_name, data]: [string, any]) => {
                    if (subjectMap[subject_name]) {
                      labels.push(subjectMap[subject_name]);
                      currentScores.push(data.current);
                      previousScores.push(data.previous);
                      completedAssignments.push(data.completed);
                      pendingAssignments.push(data.pending);
                    } else {
                      labels.push(`Subject ${subject_name}`);
                      currentScores.push(data.current);
                      previousScores.push(data.previous);
                      completedAssignments.push(data.completed);
                      pendingAssignments.push(data.pending);
                    }
                  },
                );

                setAcademicPerformanceData(
                  createAcademicPerformanceConfig(
                    currentScores,
                    previousScores,
                    labels,
                    isDarkMode,
                  ),
                );

                setCompletionRateData(
                  createCompletionRateConfig(
                    completedAssignments,
                    pendingAssignments,
                    labels,
                    isDarkMode,
                  ),
                );
              } else {
                const subjectMap: any = {};

                schoolData?.data?.subjects_data?.forEach((subject: any) => {
                  subjectMap[subject?.subject_name] = subject?.subject_name;
                });

                const labels: any = [];
                const currentScores: any = [];
                const previousScores: any = [];
                const completedAssignments: any = [];
                const pendingAssignments: any = [];
                if (!performanceData) return;
                Object.entries(performanceData)?.forEach(
                  ([subject_name, data]: [string, any]) => {
                    if (subjectMap[subject_name]) {
                      labels.push(subjectMap[subject_name]);
                      currentScores.push(data.current);
                      previousScores.push(data.previous);
                      completedAssignments.push(data.completed);
                      pendingAssignments.push(data.pending);
                    } else {
                      labels.push(`Subject ${subject_name}`);
                      currentScores.push(data.current);
                      previousScores.push(data.previous);
                      completedAssignments.push(data.completed);
                      pendingAssignments.push(data.pending);
                    }
                  },
                );

                setAcademicPerformanceData(
                  createAcademicPerformanceConfig(
                    currentScores,
                    previousScores,
                    labels,
                    isDarkMode,
                  ),
                );
                setCompletionRateData(
                  createCompletionRateConfig(
                    completedAssignments,
                    pendingAssignments,
                    labels,
                    isDarkMode,
                  ),
                );
              }
            },
          );

          getData(`/session/student-individual-stats/${student_id}`).then(
            (response) => {
              const sessionData = response.data.monthly_data;

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

              const modifiedData: any = {};

              if (!sessionData) return;

              Object.keys(sessionData)?.forEach((monthNum) => {
                const monthName = monthMapping[monthNum] || monthNum;
                modifiedData[monthName] = sessionData[monthNum];
              });

              study_data = modifiedData;
              setStudentData((prevData: any) => ({
                ...prevData,
                usage: modifiedData,
              }));

              setStudentData((prevData: any) => ({
                ...prevData,
                usage: study_data,
              }));

              const prepareTimeData = () => {
                const monthData: any = study_data[activeMonth];

                if (!monthData || monthData.length < 0) return;
                const weeks = Object.keys(monthData).filter((key) =>
                  key.startsWith('week'),
                );

                if (activeTab === 'daily') {
                  const date = new Date();
                  const currentMonth = date.getMonth();
                  const currentYear = date.getFullYear();

                  const activeMonthDate = new Date(activeMonth);
                  const isCurrentMonth =
                    activeMonthDate.getMonth() === currentMonth &&
                    activeMonthDate.getFullYear() === currentYear;

                  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

                  const weeklyData = weeks.flatMap(
                    (week) => monthData[week]?.days || [],
                  );

                  let limitedDays;
                  if (isCurrentMonth) {
                    limitedDays = days.slice(0, date.getDate());
                  } else {
                    limitedDays = days.slice(0, weeklyData.length);
                  }

                  const dailyHours = limitedDays.map(
                    (_, index) => weeklyData[index] || 0,
                  );

                  const dailyData = isCurrentMonth
                    ? dailyHours
                    : dailyHours.slice(0, 31);

                  return {
                    labels: days,
                    dailyData,
                    weeklyTotals: [],
                    recommended: Array(days.length).fill(2.5),
                  };
                } else if (activeTab === 'weekly') {
                  const weeklyLabels = weeks.map((week) =>
                    week.replace('week', 'Week '),
                  );
                  const weeklyTotals = weeks.map(
                    (week) => monthData[week].total,
                  );
                  const dailyAverages = weeks.map(
                    (week) => monthData[week].total / 7,
                  );

                  return {
                    labels: weeklyLabels,
                    dailyData: dailyAverages,
                    weeklyTotals,
                    recommended: Array(weeklyLabels.length).fill(2.5 * 7),
                  };
                } else {
                  const months = Object.keys(study_data).map((month) =>
                    month.replace('month', 'Month '),
                  );
                  const monthlyTotals = Object.values(study_data).map(
                    (month: any) => month.total,
                  );
                  const dailyAverages = Object.values(study_data).map(
                    (month: any) => month.total / 30,
                  );

                  return {
                    labels: months,
                    dailyData: dailyAverages,
                    weeklyTotals: monthlyTotals,
                    recommended: Array(months.length).fill(2.5 * 30),
                  };
                }
              };

              const timeData = prepareTimeData();

              setLearningTimeData({
                series: [
                  {
                    name: 'Daily Time (Hours)',
                    type: activeTab === 'daily' ? 'area' : 'line',
                    data: timeData?.dailyData || [],
                  },
                  ...(activeTab !== 'daily'
                    ? [
                        {
                          name:
                            activeTab === 'weekly'
                              ? 'Weekly Total Time (Hours)'
                              : 'Monthly Total Time (Hours)',
                          type: 'column',
                          data: timeData?.weeklyTotals || [],
                        },
                        {
                          name:
                            activeTab === 'weekly'
                              ? 'Recommended Weekly Time (Hours)'
                              : 'Recommended Monthly Time (Hours)',
                          type: 'line',
                          data: timeData?.recommended || [],
                        },
                      ]
                    : []),
                  ...(activeTab == 'daily'
                    ? [
                        {
                          name: 'Recommended Daily Time (Hours)',
                          type: 'line',
                          data: timeData?.recommended || [],
                        },
                      ]
                    : []),
                ],
                options: {
                  chart: {
                    height: 400,
                    type: activeTab === 'daily' ? 'area' : 'line',
                    stacked: false,
                    zoom: {
                      enabled: false,
                    },
                    theme: {
                      mode: isDarkMode ? 'dark' : 'light',
                    },
                    toolbar: { show: false },
                    dropShadow: {
                      enabled: true,
                      color: '#000',
                      top: 18,
                      left: 7,
                      blur: 10,
                      opacity: 0.1,
                    },
                  },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shade: 'light',
                      type: 'vertical',
                      shadeIntensity: 0.5,
                      gradientToColors: ['#4e73df'],
                      inverseColors: true,
                      opacityFrom: 0.9,
                      opacityTo: 0.5,
                      stops: [50, 100],
                    },
                  },

                  stroke: {
                    curve: 'smooth',

                    width: activeTab === 'daily' ? [4, 3] : [4, 0, 3],
                    dashArray: activeTab === 'daily' ? [0, 5] : [0, 0, 5],
                  },
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      borderRadius: 6,
                      columnWidth: '35%',
                      borderRadiusApplication: 'end',
                    },
                  },
                  markers: {
                    size: activeTab === 'daily' ? [0, 1] : [0, 0, 1],
                    colors: [
                      'transparent',
                      ...(activeTab !== 'daily' ? ['transparent'] : []),
                      '#1cc88a',
                    ],
                    strokeColors: [
                      'transparent',
                      ...(activeTab !== 'daily' ? ['transparent'] : []),
                      '#1cc88a',
                    ],
                    strokeWidth: 2,
                    hover: {
                      size: 6,
                    },
                  },
                  colors: [
                    '#4e73df',
                    ...(activeTab !== 'daily' ? ['#e74a3b'] : []),
                    '#1cc88a',
                  ],
                  dataLabels: { enabled: false },
                  xaxis: {
                    categories: timeData?.labels,
                    title: {
                      text: 'Time Period',
                      style: { fontWeight: 600, color: '#666' },
                    },
                    labels: {
                      style: {
                        colors: '#666', // color of x-axis labels
                      },
                    },
                  },
                  yaxis: [
                    {
                      seriesName: 'Daily Time',
                      title: {
                        text: 'Daily Time (Hours)',
                        style: { fontWeight: 600, color: '#666' },
                      },

                      min: 0,
                      labels: {
                        formatter: (val: any) => val.toFixed(1),
                        style: {
                          colors: '#666', // color of x-axis labels
                        },
                      },
                    },
                    ...(activeTab !== 'daily'
                      ? [
                          {
                            seriesName:
                              activeTab === 'weekly'
                                ? 'Weekly Total'
                                : 'Monthly Total',
                            opposite: true,
                            title: {
                              text:
                                activeTab === 'weekly'
                                  ? 'Weekly Total (Hours)'
                                  : 'Monthly Total (Hours)',
                              style: { fontWeight: 600, color: '#666' },
                            },
                            min: 0,
                            labels: { formatter: (val: any) => val.toFixed(0) },
                          },
                        ]
                      : []),
                  ],
                  legend: {
                    position: 'bottom',

                    colors: ['#666666', '#666666', '#666666'],
                  },
                  title: {
                    text: timeData?.dailyData?.length
                      ? 'Learning Time Analysis'
                      : 'No Learning Time Data Available',
                    align: 'center',
                    style: {
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#666',
                    },
                  },
                  tooltip: {
                    theme: isDarkMode ? 'dark' : 'light',
                    shared: true,
                    intersect: false,
                    y: {
                      formatter: (val: any) => `${val.toFixed(1)} hours`,
                    },
                  },
                },
              });
              const prepareStreaksData = () => {
                const monthData = study_data?.[activeMonth] || {};

                const weeks = Object.keys(monthData).filter((key) =>
                  key.startsWith('week'),
                );

                if (activeTab === 'weekly') {
                  const weeklyLabels = weeks.map((week) =>
                    week.replace('week', 'Week '),
                  );
                  const maxStreaks = weeks.map((week) =>
                    Math.min(monthData[week]?.max_streak || 0, 7),
                  );
                  const activeDays = weeks.map((week) =>
                    Math.min(monthData[week]?.total_days_active || 0, 7),
                  );
                  const engagement = weeks.map((week) =>
                    Math.min((monthData[week]?.engagement || 0) * 20, 100),
                  );

                  return {
                    labels: weeklyLabels,
                    maxStreaks,
                    activeDays,
                    engagement,
                  };
                } else if (activeTab === 'monthly') {
                  if (!study_data) return {};

                  const months = Object.keys(study_data).map((month) =>
                    month.replace('month', 'Month '),
                  );

                  const maxStreaks = Object.values(study_data).map(
                    (month: any) => {
                      const weekValues = Object.values(month)
                        .filter(
                          (week: any) => week && week.max_streak !== undefined,
                        )
                        .map((week: any) => week.max_streak);

                      return weekValues.length > 0
                        ? Math.min(Math.max(...weekValues), 30)
                        : 0;
                    },
                  );

                  const activeDays = Object.values(study_data).map(
                    (month: any) => {
                      const totalActive = Object.values(month)
                        .filter(
                          (week: any) =>
                            week && week.total_days_active !== undefined,
                        )
                        .reduce(
                          (sum: number, week: any) =>
                            sum + week.total_days_active,
                          0,
                        );

                      return Math.min(totalActive, 30);
                    },
                  );

                  const engagement = Object.values(study_data).map(
                    (month: any) => {
                      const engagementWeeks = Object.values(month).filter(
                        (week: any) => week && week.engagement !== undefined,
                      );

                      if (engagementWeeks.length === 0) return 0;

                      const avgEngagement =
                        engagementWeeks.reduce(
                          (sum: number, week: any) => sum + week.engagement,
                          0,
                        ) / engagementWeeks.length;

                      return Math.min(avgEngagement * 20, 100);
                    },
                  );

                  return {
                    labels: months,
                    maxStreaks,
                    activeDays,
                    engagement,
                  };
                }

                return {};
              };
              const streaksData = prepareStreaksData();

              setStudyStreaksData({
                series: [
                  {
                    name: 'Engagement Score',
                    type: 'line',
                    data: streaksData?.engagement || [],
                  },
                  {
                    name: 'Max Consecutive Days Active',
                    type: 'column',
                    data: streaksData?.maxStreaks || [],
                  },
                  {
                    name: 'Total Active Days',
                    type: 'column',
                    data: streaksData?.activeDays || [],
                  },
                ],
                options: {
                  chart: {
                    height: 400,
                    type: 'line',
                    stacked: false,
                    zoom: {
                      enabled: false,
                    },
                    toolbar: { show: false },
                    dropShadow: {
                      enabled: true,
                      color: '#000',
                      top: 18,
                      left: 7,
                      blur: 10,
                      opacity: 0.1,
                    },
                  },
                  stroke: {
                    curve: 'smooth',
                    width: [4, 0, 0],
                  },
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      borderRadius: 6,
                      columnWidth: '55%',
                      borderRadiusApplication: 'end',
                    },
                  },
                  colors: ['#e74a3b', '#4e73df', '#1cc88a'],
                  dataLabels: {
                    enabled: false,
                  },
                  xaxis: {
                    categories: streaksData?.labels,
                    title: {
                      text: 'Time Period',
                      style: {
                        fontWeight: 600,
                        color: '#666',
                      },
                    },
                    labels: {
                      style: {
                        colors: '#666', // color of x-axis labels
                      },
                    },
                  },
                  yaxis: [
                    {
                      seriesName: 'Engagement Score',
                      title: {
                        text: 'Engagement Score (0-100)',
                        style: {
                          fontWeight: 600,
                          color: '#666',
                        },
                      },
                      labels: {
                        style: {
                          colors: '#666', // color of x-axis labels
                        },
                      },
                      min: 0,
                      max: 100,
                    },
                    {
                      seriesName: 'Max Consecutive Days',
                      opposite: true,
                      title: {
                        text:
                          activeTab === 'monthly'
                            ? 'Days Active'
                            : 'Days Active per Week',
                        style: {
                          fontWeight: 600,
                          color: '#666',
                        },
                      },
                      min: 0,
                      max:
                        activeTab === 'daily'
                          ? 7
                          : activeTab === 'weekly'
                            ? 7
                            : 30,
                      labels: {
                        formatter: (val: number) => val.toFixed(0),
                      },
                    },
                  ],
                  legend: {
                    position: 'bottom',
                    colors: ['#666666', '#666666', '#666666'],
                  },
                  title: {
                    text: streaksData?.engagement?.length
                      ? 'Study Streaks & Engagement'
                      : 'No Study Streaks Data Available',
                    align: 'center',
                    style: {
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#666',
                    },
                  },
                  tooltip: {
                    theme: isDarkMode ? 'dark' : 'light',
                    shared: true,
                    intersect: false,
                  },
                },
              });
            },
          );
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    if (activeMonth) {
      fetchData();
    }
  }, [activeTab, activeMonth, isDarkMode]);

  return (
    <>
      <div className="col-l2">
        <div className="row mb-5 mb-lg-0">
          <div className="col-12">
            <div className="d-flex gap-3 align-items-end mb-3 flex-wrap">
              <div className="mw-180px">
                <label className="col-form-label">Month:</label>
                <select
                  className="form-select mw-180px"
                  value={activeMonth}
                  onChange={(e) => setActiveMonth(e.target.value)}
                >
                  {getMonths().map((month: any) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="tabs-container">
                <div
                  className="btn-group mw-180px"
                  role="group"
                  aria-label="Tab selection"
                >
                  <input
                    type="radio"
                    className="btn-check"
                    name="tabOptions"
                    id="tabDaily"
                    autoComplete="off"
                    checked={activeTab === 'daily'}
                    onChange={() => setActiveTab('daily')}
                  />
                  <label className="btn btn-outline-primary" htmlFor="tabDaily">
                    Daily
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="tabOptions"
                    id="tabWeekly"
                    autoComplete="off"
                    checked={activeTab === 'weekly'}
                    onChange={() => setActiveTab('weekly')}
                  />
                  <label
                    className="btn btn-outline-primary"
                    htmlFor="tabWeekly"
                  >
                    Weekly
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="tabOptions"
                    id="tabMonthly"
                    autoComplete="off"
                    checked={activeTab === 'monthly'}
                    onChange={() => setActiveTab('monthly')}
                  />
                  <label
                    className="btn btn-outline-primary"
                    htmlFor="tabMonthly"
                  >
                    Monthly
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div
            className={
              activeTab !== 'daily'
                ? 'col-xl-6 col-lg-6 mb-4'
                : 'col-xl-12 col-lg-12 mb-4'
            }
          >
            <div className="card shadow h-100">
              <div className="card-body">
                <ReactApexChart
                  options={learningTimeData.options}
                  series={learningTimeData.series}
                  type="line"
                  height={400}
                />
              </div>
            </div>
          </div>
          {activeTab !== 'daily' && (
            <div className="col-xl-6 col-lg-6 mb-4">
              <div className="card shadow h-100">
                <div className="card-body">
                  <ReactApexChart
                    options={studyStreaksData.options}
                    series={studyStreaksData.series}
                    type="line"
                    height={400}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="col-xl-6 col-lg-6 mb-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <ReactApexChart
                  options={academicPerformanceData.options}
                  series={academicPerformanceData.series}
                  type="bar"
                  height={350}
                />
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 mb-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <ReactApexChart
                  options={completionRateData?.options}
                  series={completionRateData?.series}
                  type="bar"
                  height={350}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboardCharts;
