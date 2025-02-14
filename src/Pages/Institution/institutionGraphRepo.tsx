import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
const InstituteGraphRepo = () => {
  const options: ApexOptions = {
    series: [
      {
        name: 'Desktops',
        data: [14, 41, 35, 51, 25, 18, 21],
      },
    ],
    chart: {
      foreColor: '#9ba7b2',
      height: 280,
      type: 'bar',
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 1,
      curve: 'smooth',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        borderRadiusApplication: 'around',
        borderRadiusWhenStacked: 'last',
        columnWidth: '45%',
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        gradientToColors: ['#009efd'],
        shadeIntensity: 1,
        type: 'vertical',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100],
      },
    },
    colors: ['#2af598'],
    grid: {
      show: true,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    xaxis: {
      categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
    tooltip: {
      theme: 'dark',
      marker: {
        show: false,
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
      <div className="col-xl-6 d-flex align-items-stretch">
        <div className="card w-100 rounded-4 mt-lg-0 mt-4">
          <div className="card-body">
            <h6 className="mb-0">Exam Grade Statistics</h6>
            <div className="mt-4" id="chart5">
              <Chart
                options={options}
                series={options.series}
                type="bar"
                height={280}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-6 d-flex align-items-stretch">
        <div className="row w-100">
          <div className="col-lg-6">
            <div className="card w-100 rounded-4">
              <div className="card-body">
                <div className="chart-container2">
                  <Chart
                    options={options1}
                    series={options1.series}
                    type="radialBar"
                    height={180}
                  />
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
                  <Chart
                    options={options2}
                    series={options2.series}
                    type="radialBar"
                    height={180}
                  />
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
                  <Chart
                    options={options3}
                    series={options3.series}
                    type="radialBar"
                    height={180}
                  />
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

export default InstituteGraphRepo;
