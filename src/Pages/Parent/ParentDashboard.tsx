/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Card,
  Typography,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import StudentProfile from '../../assets/img/avatar3.jpg';
import {
  Assignment,
  QuestionMark,
  Quiz,
  RemoveRedEyeOutlined,
  VisibilitySharp,
} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chart from 'react-apexcharts';

const ParentDashboard = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    gender: '',
    dob: dayjs(),
    photo: null as File | null,
  });

  const barChartOptions = {
    chart: {
      id: 'chart5',
      height: 295,
      width: '100%',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        horizontal: false,
        columnWidth: '50%',
      },
    },
    xaxis: {
      categories: ['Math', 'Science', 'English', 'Hindi', 'Art', 'GK', 'Msc'],
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#9943EC'], // Green border for the bars
    },
    colors: ['#9943EC'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: ['#9943EC'],
        inverseColors: true,
        // opacityFrom: 0.85,
        // opacityTo: 0.85,
        stops: [50, 80],
      },
    },
  };

  const barChartSeries = [
    {
      name: 'Data',
      data: [10, 69, 35, 100, 30, 25, 30], // The values based on the chart
    },
  ];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      handleChange('photo', event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    setOpen(false);
  };

  return (
    <div className="main-wrapper pb-5 pb-lg-4">
      <div className="main-content p-0">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              Open Parent Verification Form
            </Button> */}

            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Parent Verification</DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="First Name"
                      fullWidth
                      size="small"
                      value={formData.fname}
                      onChange={(e) => handleChange('fname', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Last Name"
                      fullWidth
                      size="small"
                      value={formData.lname}
                      onChange={(e) => handleChange('lname', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Email"
                      fullWidth
                      size="small"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Phone Number"
                      fullWidth
                      size="small"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Gender</InputLabel>
                      <Select
                        label="Gender"
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      label="Date of Birth"
                      value={formData.dob}
                      onChange={(newValue: Dayjs | null) =>
                        handleChange('dob', newValue ?? dayjs())
                      }
                      slotProps={{
                        textField: { fullWidth: true, size: 'small' },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Card
                          variant="outlined"
                          sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}
                        >
                          <Typography variant="h6" gutterBottom>
                            Live Photo Verification
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <Box
                              component="img"
                              src={
                                formData.photo
                                  ? URL.createObjectURL(formData.photo)
                                  : 'https://via.placeholder.com/150x150?text=No+Photo'
                              }
                              alt="Live photo preview"
                              sx={{
                                width: 150,
                                height: 150,
                                objectFit: 'cover',
                                borderRadius: '50%',
                                border: '2px dashed #ccc',
                              }}
                            />
                            <Button variant="contained" component="label">
                              Upload Live Photo
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileChange}
                              />
                            </Button>
                            {formData.photo && (
                              <Typography variant="body2" color="textSecondary">
                                Selected: {formData.photo.name}
                              </Typography>
                            )}
                          </Box>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)} color="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </LocalizationProvider>

        <div className="parentdash">
          <div className="parentprofile">
            <h2 className="text-white fw-bold">Welcome Back Dear Parent </h2>
            <p className="opacity-75">
              Track Your Little One Brain Development & Activity
            </p>
          </div>

          <div className="studentstabdata">
            <div className="studenttabs">
              <ul className="nav nav-pills " role="tablist">
                <li className="nav-item">
                  <button
                    className="nav-link active"
                    data-bs-target="#pills-rahul"
                    type="button"
                    role="tab"
                    data-bs-toggle="pill"
                    aria-selected="true"
                  >
                    Rahul Sharma
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link"
                    data-bs-target="#pills-shruti"
                    type="button"
                    role="tab"
                    data-bs-toggle="pill"
                  >
                    Shruti Sharma
                  </button>
                </li>
              </ul>
            </div>

            <div className="tab-content" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="pills-rahul"
                role="tabpanel"
              >
                <div className="row g-4">
                  <div className="col-lg-3">
                    <div className="card cardwithshadow bg-primary-subtle">
                      <div className="card-header">
                        <div className="row">
                          <div className="col-12">
                            <div className="d-flex align-items-center gap-lg-3 gap-2 mobile-profile">
                              <img
                                src={StudentProfile}
                                className="rounded-circle img-fluid bg-grd-info p-1"
                                width="80"
                                height="80"
                                alt="user"
                              />
                              <div className="w-100">
                                <div className="d-flex justify-content-between align-items-start mb-2 mb-lg-0">
                                  <div className="">
                                    <h4 className="fw-semibold mb-1 fs-18 mb-0">
                                      Rahul Sharma
                                    </h4>
                                    <small className="mb-0 d-block ">
                                      Grade 10-A | Student ID: 2024-0123
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body position-relative">
                        <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                          <div>
                            <h6 className="mb-0 fw-normal fs-14">Status</h6>
                          </div>

                          <div className="form-check form-switch mb-0 ">
                            <input
                              className="form-check-input fs-5 m-0"
                              type="checkbox"
                              id="status"
                              checked={true}
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-3 mb-3">
                          <div className="flex-grow-1">
                            <h6 className="mb-0 fw-normal fs-14">
                              Chat History
                            </h6>
                          </div>
                          <div>10</div>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                          <div className="flex-grow-1">
                            <h6 className="mb-0 fw-normal fs-14">Saved Chat</h6>
                          </div>
                          <div>8</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="row g-4">
                      <div className="col-12">
                        <div className="card cardwithshadow">
                          <div className="card-body">
                            <div className="card-content">
                              <span className="with-circle blue-circle">
                                <Assignment />
                              </span>
                              <div className="">
                                <h1>85 %</h1>
                                <p>Assignments Completed</p>
                              </div>
                              <div className="fixed-icon">
                                <Tooltip title="View All">
                                  <IconButton size="small">
                                    <QuestionMark fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="card cardwithshadow">
                          <div className="card-body">
                            <div className="card-content">
                              <span className="with-circle orange-circle">
                                <Quiz />
                              </span>
                              <div className="">
                                <h1>85 %</h1>
                                <p>Quizess Completed</p>
                              </div>
                              <div className="fixed-icon">
                                <Tooltip title="View All">
                                  <IconButton size="small">
                                    <VisibilitySharp fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="card cardwithshadow">
                      <div className="card-body">
                        <h6 className="fw-bold">Reports</h6>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="card cardwithshadow bg-warning">
                      <div className="card-body">
                        <h6 className="fw-bold">Notifications</h6>

                        <ul className="with-arrow">
                          <li>
                            Class 8th Results will be declared on{' '}
                            <span className="text-danger">25-Dec-2025</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="card cardwithshadow">
                      <div className="card-body">
                        <h6>Student Performance</h6>

                        <div className="mt-4">
                          <Chart
                            options={barChartOptions}
                            series={barChartSeries}
                            type="bar"
                            height={'280px'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="card cardwithshadow">
                      <div className="card-body">
                        <h6 className='mb-4'>Subject Teachers</h6>
                        <div className="table-resposnive">
                        <table className="table table-borderless">
                          <thead>
                            <tr>
                              <th>Subject</th>
                              <th>Teacher Name</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Math</td>
                              <td>Surendar Sharma</td>
                              <td>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<RemoveRedEyeOutlined />}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>

                            <tr>
                              <td>Math</td>
                              <td>Surendar Sharma</td>
                              <td>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<RemoveRedEyeOutlined />}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>

                            <tr>
                              <td>Math</td>
                              <td>Surendar Sharma</td>
                              <td>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<RemoveRedEyeOutlined />}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>

                            <tr>
                              <td>Math</td>
                              <td>Surendar Sharma</td>
                              <td>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<RemoveRedEyeOutlined />}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>

                            <tr>
                              <td>Math</td>
                              <td>Surendar Sharma</td>
                              <td>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<RemoveRedEyeOutlined />}
                                >
                                  View Details
                                </Button>
                              </td>
                            </tr>

                          </tbody>
                        </table>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade" id="pills-shruti" role="tabpanel">
                Shruti
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
