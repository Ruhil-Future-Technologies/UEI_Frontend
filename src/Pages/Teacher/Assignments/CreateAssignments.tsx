import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  //InputLabel,
  //Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  SelectChangeEvent
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import AttachFileIcon from '@mui/icons-material/AttachFile';

export const CreateAssignments = () => {
  const [assignmentType, setAssignmentType] = useState('written');
  const [files, setFiles] = useState<File[]>([]);
  const [availableFrom, setAvailableFrom] = useState<Date | null>(null);
  const [availableUntil, setAvailableUntil] = useState<Date | null>(null);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueTime, setDueTime] = useState<Date | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const classOptions = ['Class 1', 'Class 2', 'Class 3', 'Class 4'];

  const handleClassChange = (
    event: SelectChangeEvent<typeof selectedClasses>,
  ) => {
    const value = event.target.value;
    setSelectedClasses(typeof value === 'string' ? value.split(',') : value);
  };

  const handleFileRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">
            {' '}
            <Link to={'/teacher-dashboard'} className="text-dark">
              Dashboard
            </Link>
          </div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item active" aria-current="page">
                  Assignments
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-6">
            <div className="card p-4">
              <div className="cardbody">
                <div className="row g-4">
                  <div className="col-12">
                    <Typography variant="h5" className="mb-4 fw-bold">
                      Create Assignment
                    </Typography>
                    <TextField
                      fullWidth
                      label="Assignment Title"
                      variant="outlined"
                    />
                  </div>
                  <div className="col-12">
                    <Typography variant="subtitle1" className="mb-2">
                      Assignment Type
                    </Typography>
                    <ToggleButtonGroup
                      value={assignmentType}
                      exclusive
                      onChange={(_, newValue) => setAssignmentType(newValue)}
                      fullWidth
                      className="assignbtngrp"
                    >
                      <ToggleButton value="written">
                        {' '}
                        <AssignmentIcon /> Written
                      </ToggleButton>
                      <ToggleButton value="quiz">
                        <QuizIcon /> Quiz
                      </ToggleButton>
                      <ToggleButton value="project">
                        <AccountTreeIcon /> Project
                      </ToggleButton>
                      <ToggleButton value="presentation">
                        {' '}
                        <PresentToAllIcon />
                        Presentation
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                  <div className="col-12">
                    <Typography variant="subtitle1">Attachments</Typography>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      multiple
                      style={{ display: 'none' }}
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="uploadfile">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                      >
                        Browse Files
                      </Button>
                    </label>
                    <List>
                      {files.map((file, index) => (
                        <ListItem
                          className="fileslistitem"
                          key={index}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              onClick={() => handleFileRemove(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <div className="pinwi-20">
                            <AttachFileIcon />
                          </div>
                          <ListItemText primary={file.name} />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                  <div className="col-lg-6">
                    <TextField
                      fullWidth
                      label="Points"
                      variant="outlined"
                      type="number"
                    />
                  </div>
                  <div className="col-12">
                    <TextField
                      fullWidth
                      label="Instructions"
                      variant="outlined"
                      multiline
                      rows={4}
                    />
                  </div>
                  <div className="col-12">
                  <Typography className='mb-2 fs-14'>
                        Select class or group
                      </Typography>
                    <FormControl fullWidth>
                      
                      <Select
                        labelId="select-class-group-label"
                        multiple
                        value={selectedClasses}
                        onChange={handleClassChange}
                        renderValue={(selected) => selected.join(', ')}
                      >
                        {classOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            <Checkbox
                              checked={selectedClasses.indexOf(option) > -1}
                            />
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="col-lg-12">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div className="row g-4">
                        <div className="col-lg-6">
                          <DesktopDatePicker
                            label="Available From"
                            value={availableFrom}
                            onChange={(newValue) => setAvailableFrom(newValue)}
                            slots={{
                              textField: (params) => <TextField {...params} />,
                            }}
                          />
                        </div>
                        <div className="col-lg-6">
                          <DesktopDatePicker
                            className="col-6"
                            label="Available Until"
                            value={availableUntil}
                            onChange={(newValue) => setAvailableUntil(newValue)}
                            slots={{
                              textField: (params) => <TextField {...params} />,
                            }}
                          />
                        </div>
                        <div className="col-lg-6">
                          <DesktopDatePicker
                            className="col-6"
                            label="Due Date"
                            value={dueDate}
                            onChange={(newValue) => setDueDate(newValue)}
                            slots={{
                              textField: (params) => <TextField {...params} />,
                            }}
                          />
                        </div>
                        <div className="col-lg-6">
                          <TimePicker
                            className="col-6"
                            label="Due Time"
                            value={dueTime}
                            onChange={(newValue) => setDueTime(newValue)}
                            slots={{
                              textField: (params) => <TextField {...params} />,
                            }}
                          />
                        </div>
                      </div>
                    </LocalizationProvider>
                  </div>
                  <div className="col-12">
                    <div className="d-flex flex-column ">
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Allow late submissions"
                      />
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Send notification to students"
                      />
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Add to student report"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="d-flex align-items-center gap-2 justify-content-end">
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: 20, marginRight: 10 }}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        style={{ marginTop: 20, marginRight: 10 }}
                      >
                        Save as Draft
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        style={{ marginTop: 20 }}
                      >
                        Publish
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
