/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  MenuItem,
  Select,
  IconButton,
  Box,
  Chip,
  TextField,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import useApi from '../../../hooks/useAPI';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Assignment } from './CreateAssignments';
import { toast } from 'react-toastify';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { toTitleCase } from '../../../utils/helpers';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Students {
  first_name: string;
  last_name: string;
  is_submitted: any;
  is_graded: any;
  student_id: string;
  graded_points: string;
  submission_date: string;
  assignment_submition_id: string;
  student_uuid: string;
}

const AssignmentDetails = () => {
  const { id } = useParams();
  const { getData, putData } = useApi();

  const nevigate = useNavigate();
  const [assignmentData, setAssignmentData] = useState<Assignment>();
  const [students, setStudents] = useState<Students[]>([]);
  const [editId, setEditId] = useState(null);
  const [tempMarks, setTempMarks] = useState('');

  const handleEdit = (id: any) => {
    setEditId(id);
  };

  const handleSave = (Submition_id: any) => {
    if (
      assignmentData?.points &&
      tempMarks <= assignmentData?.points &&
      tempMarks != ''
    ) {
      const formData = new FormData();
      formData.append('graded_points', tempMarks);
      putData(`/assignment_submission/edit/${Submition_id}`, formData)
        .then((response) => {
          if (response?.status) {
            toast.success(response.message, {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
            window.location.reload();
          }
        })
        .catch((error) => {
          toast.error(error.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        });
      setEditId(null);
    } else {
      toast.error('Please enter valid points', {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
      });
    }
  };
  useEffect(() => {
    getAssignmentData();
    getListOfStudnetsForAssignment();
  }, []);

  const getAssignmentData = () => {
    getData(`/assignment/get/${id}`)
      .then(async (response) => {
        if (response.status) {
          setAssignmentData(response.data);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
  };

  const getListOfStudnetsForAssignment = () => {
    getData(`/assignment_submission/details/${id}`).then((response) => {
      if (response?.status) {
        setStudents(response?.data);
      }
    });
  };

  const gotoPreview = (id: any) => {
    nevigate(`/teacher-dashboard/student-assignment-details/${id}`);
  };

  const handleBack = () => {
    nevigate(-1); // navigates to the previous page
  };
  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">
          <div className="d-flex align-items-center gap-2">
            <ArrowBackIcon role="button" onClick={handleBack} />
            <Link to={'/teacher-dashboard'} className="text-dark">
              Dashboard
            </Link>
            </div>
          </div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item active" aria-current="page">
                  Assignment Details
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <Box sx={{ margin: 'auto', borderRadius: 2 }}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Student Submissions
            </Typography>
            <Select size="small" defaultValue="Change Assignment">
              <MenuItem value="Change Assignment">Change Assignment</MenuItem>
            </Select>
          </Box>

          {/* Assignment Title */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            {toTitleCase(assignmentData?.title || '')}
          </Typography>

          {/* Table */}
          <TableContainer component={Paper}>
            <Table sx={{ position: 'relative' }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Student</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Submission Time & Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Grade</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {student.first_name + ' ' + student.last_name}
                    </TableCell>
                    <TableCell>{student?.submission_date}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          student.is_graded == true
                            ? 'Graded'
                            : student.is_submitted == true
                              ? 'Submitted'
                              : 'Pending'
                        }
                        color={
                          student.is_graded == true
                            ? 'success'
                            : student.is_submitted == true
                              ? 'primary'
                              : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {editId === student.student_id ? (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <TextField
                            variant="standard"
                            value={tempMarks}
                            autoComplete="off"
                            onChange={(e) =>
                              setTempMarks(
                                assignmentData?.points &&
                                  assignmentData?.points < e.target.value
                                  ? ''
                                  : e.target.value,
                              )
                            }
                            sx={{
                              width: '25px',
                              textAlign: 'center',
                              fontSize: '16px',
                              fontWeight: 'bold',
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              marginLeft: '5px',
                            }}
                          >
                            /{assignmentData?.points}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              handleSave(student.assignment_submition_id)
                            }
                          >
                            {student?.is_submitted == true && (
                              <CheckOutlinedIcon color="success" />
                            )}
                          </IconButton>
                        </div>
                      ) : (
                        <Typography
                          onClick={
                            student.is_submitted == true
                              ? () => handleEdit(student.student_id)
                              : undefined
                          }
                          sx={{
                            cursor: student.is_submitted
                              ? 'pointer'
                              : 'default',
                            color: student.is_submitted ? 'inherit' : 'gray',
                          }}
                        >
                          {student.graded_points === 'Not Graded'
                            ? `NG/ ${assignmentData?.points}`
                            : `${student.graded_points}/ ${assignmentData?.points}`}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.is_submitted == true ? (
                        <IconButton
                          color="primary"
                          onClick={() => gotoPreview(student?.student_uuid)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      ) : (
                        <VisibilityIcon color="disabled" />
                      )}
                      {student.is_submitted == true
                        ? ' Preview'
                        : ' Not Submitted'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
    </div>
  );
};

export default AssignmentDetails;
