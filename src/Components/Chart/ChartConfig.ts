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
  legend: { position: 'bottom' },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 2,
      endingShape: 'rounded',
    },
  },
};

export const createAcademicPerformanceConfig = (
  currentScores: any,
  previousScores: any,
  subjectLabels: any,
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
        title: { text: 'Subjects' },
      },
      yaxis: {
        title: { text: 'Assignment Scores (%)' },
        min: 0,
        max: 100,
      },
      fill: { opacity: 1 },
      colors: ['#4e73df', '#36b9cc'],
      title: {
        text: 'Overall Academic Performance',
        align: 'center',
        style: { fontSize: '16px', fontWeight: 'bold' },
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val + '%';
          },
        },
      },
    },
  };
};

export const createCompletionRateConfig = (
  completedAssignments: any,
  pendingAssignments: any,
  subjectLabels: any,
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
        title: { text: 'Subjects' },
      },
      yaxis: {
        title: { text: 'Number of Assignments' },
      },
      fill: { opacity: 1 },
      colors: ['#1cc88a', '#D76C82'],
      title: {
        text: 'Assignment Completion Status',
        align: 'center',
        style: { fontSize: '16px', fontWeight: 'bold' },
      },
    },
  };
};
