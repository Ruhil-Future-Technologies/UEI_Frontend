import React from 'react';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
const TeacherGraph = () => {
  const chartSeries = [
    { name: 'Exams', data: [10, 20, 35, 15, 25, 5, 15] },
    { name: 'Materials', data: [5, 25, 20, 22, 18, 12, 8] },
  ];
  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      markers: {
        size: 8,
      },
    },
    colors: ['#00B894', '#FDCB6E'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
  };
  const options1: ApexOptions = {
    series: [78],
    chart: {
      height: 180,
      type: 'radialBar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -115,
        endAngle: 115,
        hollow: {
          margin: 0,
          size: '80%',
          background: 'transparent',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: false,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: 'rgba(0, 0, 0, 0.1)',
          strokeWidth: '67%',
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: false,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: false,
            color: '#888',
            fontSize: '17px',
          },
          value: {
            offsetY: 10,
            color: '#111',
            fontSize: '24px',
            show: true,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#ffd200'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    colors: ['#ee0979'],
    stroke: {
      lineCap: 'round',
    },
    labels: ['Total Orders'],
  };
  const options2: ApexOptions = {
    series: [65],
    chart: {
      height: 180,
      type: 'radialBar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -115,
        endAngle: 115,
        hollow: {
          margin: 0,
          size: '80%',
          background: 'transparent',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: false,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: 'rgba(0, 0, 0, 0.1)',
          strokeWidth: '67%',
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: false,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: false,
            color: '#888',
            fontSize: '17px',
          },
          value: {
            offsetY: 10,
            color: '#111',
            fontSize: '24px',
            show: true,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#10B981'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    colors: ['#10B981'],
    stroke: {
      lineCap: 'round',
    },
    labels: ['Total Orders'],
  };

  const options3: ApexOptions = {
    series: [25],
    chart: {
      height: 180,
      type: 'radialBar',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -115,
        endAngle: 115,
        hollow: {
          margin: 0,
          size: '80%',
          background: 'transparent',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: false,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24,
          },
        },
        track: {
          background: 'rgba(0, 0, 0, 0.1)',
          strokeWidth: '67%',
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: false,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35,
          },
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: false,
            color: '#888',
            fontSize: '17px',
          },
          value: {
            offsetY: 10,
            color: '#111',
            fontSize: '24px',
            show: true,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#C717D8'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    colors: ['#ee0979'],
    stroke: {
      lineCap: 'round',
    },
    labels: ['Total Orders'],
  };
  return (
    <>
      <div className="col-xl-7 d-flex align-items-stretch">
        <div className="card w-100 rounded-4 mt-lg-0 mt-4">
          <div className="card-body">
            <div className="d-flex mb-3 justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">Learning Activity</h6>
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-outline-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  I 3rd semester
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="">
                      Something else here
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="chart-container1">
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="area"
                width="100%"
                height="300"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="col-xl-5 d-flex align-items-stretch">
        <div className="row w-100">
          <div className="col-lg-6">
            <div className="card w-100 rounded-4">
              <div className="card-body">
                <div className="chart-container2">
                  <div id="chart1">
                    <Chart
                      options={options1}
                      series={options1.series}
                      type="radialBar"
                      height={180}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="mb-0 ">Addmission Rate</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card w-100 rounded-4">
              <div className="card-body">
                <div className="chart-container2">
                  <div id="chart4">
                    <Chart
                      options={options2}
                      series={options2.series}
                      type="radialBar"
                      height={180}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="mb-0 ">Syllabus Coverage</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card w-100 rounded-4">
              <div className="card-body">
                <div className="chart-container2">
                  <div id="chart3">
                    <Chart
                      options={options3}
                      series={options3.series}
                      type="radialBar"
                      height={180}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="mb-0 ">Fee Collection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherGraph;
