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
  Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

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
    <div className="main-wrapper">
      <div className="main-content p-0">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              Open Parent Verification Form
            </Button>

            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Parent Verification</DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={2} >
                  <Grid item xs={6}>
                    <TextField
                      label="First Name"
                      fullWidth
                      size='small'
                      value={formData.fname}
                      onChange={(e) => handleChange('fname', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Last Name"
                      fullWidth
                       size='small'
                      value={formData.lname}
                      onChange={(e) => handleChange('lname', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Email"
                      fullWidth
                       size='small'
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Phone Number"
                      fullWidth
                       size='small'
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth  size='small'>
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
                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
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
                <div className="row">
                  <div className="col-lg-3">
                    <div className="card w-100 overflow-hidden rounded-4 shadow-none desk-card">
                      <div className="card-header bg-primary-20 border-bottom-0">
                        <div className="row">
                          <div className="col-12">
                            <div className="d-flex align-items-center gap-lg-3 gap-2 mobile-profile">
                              <div className="w-100">
                                <div className="d-flex justify-content-between align-items-start mb-2 mb-lg-0">
                                  <div className="">
                                    <h4 className="fw-semibold mb-0 fs-18 mb-0">
                                      rahul
                                    </h4>
                                    <small className="mb-lg-3 mb-1 d-block ">
                                      EEE
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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
