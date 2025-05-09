/* eslint-disable @typescript-eslint/no-explicit-any */
export const sharedChartOptions = {
  chart: {
    height: 350,
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  dataLabels: { enabled: false },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  legend: { 
     position: 'bottom',
     labels: {
    // single string or array of strings
    // Apex will cycle through if you give fewer colors than series
    colors: ['#666666', '#666666', '#666666'], 
  },},
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 2,
      endingShape: 'rounded',
    },
  },
};

// 🔧 ADDED isDarkMode PARAMETER
export const createAcademicPerformanceConfig = (
  currentScores: any,
  previousScores: any,
  subjectLabels: any,
  isDarkMode: boolean // ← Added dark mode toggle
) => {
  return {
    series: [
      { name: 'Current Assignment Scores', data: currentScores },
      { name: 'Previous Assignment Scores', data: previousScores },
    ],
    options: {
      ...sharedChartOptions,
      chart: {
        ...sharedChartOptions.chart,
        type: 'bar',
        stacked: false,
      },
      xaxis: {
        categories: subjectLabels,
        title: { text: 'Subjects', style: { fontWeight: 600, color: '#666' }, },
        labels: {
          // 🎨 ADDED dynamic label color
          style: {
            colors: isDarkMode ? '#666666' : '#666666',
          },
        },
      },
      yaxis: {
        title: { text: 'Assignment Scores (%)' },
        min: 0,
        max: 100,
        labels: {
          // 🎨 ADDED dynamic label color
          style: {
            colors: isDarkMode ? '#666666' : '#666666',
          },
        },
      },
      legend: { 
        position: 'bottom',
        labels: {
       // single string or array of strings
       // Apex will cycle through if you give fewer colors than series
       colors: ['#666666', '#666666', '#666666'], 
     },},
      fill: { opacity: 1 },
      colors: ['#4e73df', '#36b9cc'],
      title: {
        text: 'Overall Academic Performance',
        align: 'center',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          // 🎨 ADDED dynamic title color
          color: isDarkMode ? '#666666' : '#666666',
        },
      },
      tooltip: {
        // 🌙 ADDED dynamic tooltip theme
        theme: isDarkMode ? 'dark' : 'light',
        y: {
          formatter: (val: any) => `${val}%`,
        },
      },
      // 🎨 ADDED grid border color based on mode
      grid: {
        borderColor: isDarkMode ? '#444' : '#e0e0e0',
      },
    },
  };
};

// 🔧 ADDED isDarkMode PARAMETER
export const createCompletionRateConfig = (
  completedAssignments: any,
  pendingAssignments: any,
  subjectLabels: any,
  isDarkMode: boolean // ← Added dark mode toggle
) => {
  return {
    series: [
      { name: 'Completed Assignments', data: completedAssignments },
      { name: 'Pending Assignments', data: pendingAssignments },
    ],
    options: {
      ...sharedChartOptions,
      chart: {
        ...sharedChartOptions.chart,
        type: 'bar',
        stacked: true,
      },
      xaxis: {
        categories: subjectLabels,
        title: { text: 'Subjects', style: { fontWeight: 600, color: '#666' }, },
        labels: {
          // 🎨 ADDED dynamic label color
          style: {
            colors: isDarkMode ? '#666666' : '#666666',
          },
        },
      },
      yaxis: {
        title: { text: 'Number of Assignments' },
        labels: {
          // 🎨 ADDED dynamic label color
          style: {
            colors: isDarkMode ? '#666666' : '#666666',
          },
        },
      },
      legend: { 
        position: 'bottom',
        labels: {
       // single string or array of strings
       // Apex will cycle through if you give fewer colors than series
       colors: ['#666666', '#666666', '#666666'], 
     },},
      fill: { opacity: 1 },
      colors: ['#1cc88a', '#D76C82'],
      title: {
        text: 'Assignment Completion Status',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          // 🎨 ADDED dynamic title color
          color: isDarkMode ? '#666666' : '#666666',
        },
      },
      tooltip: {
        // 🌙 ADDED dynamic tooltip theme
        theme: isDarkMode ? 'dark' : 'light',
      },
      // 🎨 ADDED grid border color based on mode
      grid: {
        borderColor: isDarkMode ? '#444' : '#e0e0e0',
      },
    },
  };
};
