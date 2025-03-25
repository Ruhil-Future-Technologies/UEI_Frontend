import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,

  TextField,
  Chip,
  IconButton,
  ListItem,
  ListItemText,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useApi from '../../../hooks/useAPI';
import { Assignment } from '../../Teacher/Assignments/CreateAssignments';
import { toTitleCase } from '../../../utils/helpers';
import { toast } from 'react-toastify';
import UploadBtn from '../../../Components/UploadBTN/UploadBtn';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const PreviewAndSubmit = () => {
  const navigate = useNavigate();
  const { getData } = useApi();
  const { id } = useParams();
  const [assignmentData, setAssignmentData] = useState<Assignment>();
  //const [todayDate, setTodayDate] = useState<Date>();
  const [remainingDays, setRemaingDays] = useState(0);
  const [document_error, setDocument_error] = useState(false);
  const [allselectedfiles, setAllSelectedfiles] = useState<File[]>([]);

  const handleBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    getAssignmentData();
  }, [])


  const getAssignmentData = () => {
    try {
      getData(`/assignment/get/${id}`).then((response) => {
        if (response?.status) {
          setAssignmentData(response?.data);
          const dueDate = new Date(response?.due_date_time);
          const today = new Date();
          const differenceInMs = dueDate.getTime() - today.getTime();

          // Convert milliseconds to days (1 day = 86400000 ms)
          const remainingDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
          console.log(remainingDays)
          setRemaingDays(dueDate.getTime() > today.getTime() ? remainingDays : 0)
        }
      })
    } catch (error: any) {
      toast.error(error.message, {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center'
      })
    }
  }


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setDocument_error(false);

    if (files && event.target.name !== 'icon') {
      const filesArray = Array.from(files);

      setAllSelectedfiles((prevFiles) => [
        ...prevFiles, // Keep previously selected files
        ...filesArray, // Add newly selected files
      ]);

      // Reset the input field to allow selecting the same files again
      event.target.value = '';
    } else {
      // setLogo(files);
    }
  };

  const handleFileRemove = (index: number) => {

    setAllSelectedfiles(allselectedfiles.filter((_, i) => i !== index));
    if ((allselectedfiles.length == 1)) {
      setDocument_error(true)
    } else {
      setDocument_error(false)
    }

  };

  return (
    <>
      <div className="main-wrapper">
        <div className="main-content">
          <div className="page-breadcrumb d-flex align-items-center mb-3">
            <div className="breadcrumb-title pe-3">
              <div className="d-flex gap-1 align-items-center" role='button'> <ArrowBackIcon onClick={handleBack} className='me-1' />


                <Link to={'/main/dashboard'} className="text-dark">
                  Dashboard
                </Link></div>

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
          <div className="row g-2">
            <div className="col-lg-7">
              <Typography variant="h4" fontWeight="bold">
                {toTitleCase(assignmentData?.title || '')}
              </Typography>
              <Typography variant="body2" color="text.secondary" className='d-inline-flex align-items-center gap-1 mt-2'>
                <AccessTimeIcon fontSize='small' /> Time remaining: {remainingDays} days | <ScoreboardOutlinedIcon fontSize='small' />Points: {assignmentData?.points}
              </Typography>
            </div>
            <div className="col-lg-5">
              <div className="d-flex align-items-center justify-content-end"><AccessTimeIcon /> <span className='text-danger ms-2 me-3'> Due: {assignmentData?.due_date_time}</span><Chip label="Pending" color="warning" /> </div>

            </div>
          </div>


          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6">Assignment Description</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Create a fully functional e-commerce website using React and
                Node.js. The website should include the following features and
                meet all specified requirements.
              </Typography>
              <Typography variant="h6" className="mt-3">
                Instructions
              </Typography>
              <ul>
                <li>
                  {assignmentData?.instructions}
                </li>
              </ul>

              <hr className="my-4" />

              <Box>
                <Typography variant="h6">Resources</Typography>
                <ul>
                  {
                    assignmentData?.file?.map((file) => (
                      <li>
                        <Link to={'#'}>{file.name}</Link>
                      </li>
                    ))
                  }
                  {/* <li>
                    <a href="#">Project Requirements Document.pdf</a>
                  </li>
                  <li>
                    <a href="#">API Documentation.pdf</a>
                  </li>
                  <li>
                    <a href="#">Design Guidelines.pdf</a>
                  </li> */}
                </ul>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" className='mb-3'>Submit Your Work</Typography>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  p: 3,
                  textAlign: 'center',
                  borderRadius: '8px',
                }}
              >
                <CloudUploadIcon fontSize="large" />
                <Typography variant="body2" color="text.secondary">
                  Drag and drop your files here or click to browse
                </Typography>
                <UploadBtn
                  label="Upload Documents"
                  name="document"
                  accept=".pdf, .jpg, .jpeg, .png, .gif"
                  handleFileChange={handleFileChange}
                />
              </Box>
              {allselectedfiles.map((file, index) => (
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
              {document_error &&
                <p className="error-text " style={{ color: 'red' }}>
                  <small> Please add at least one file.</small>
                </p>
              }
              <TextField
                fullWidth
                label="Add Remarks (Optional)"
                multiline
                rows={3}
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6">Submission History</Typography>
              <TableContainer sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>Date</b>
                      </TableCell>
                      <TableCell>
                        <b>File Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Status</b>
                      </TableCell>
                      <TableCell>
                        <b>Remarks</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Dec 10, 2023</TableCell>
                      <TableCell>
                        <a href="#">project_draft_v1.zip</a>
                      </TableCell>
                      <TableCell>Draft</TableCell>
                      <TableCell>Initial project structure</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Dec 12, 2023</TableCell>
                      <TableCell>
                        <a href="#">project_draft_v2.zip</a>
                      </TableCell>
                      <TableCell>Draft</TableCell>
                      <TableCell>Added core features</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          <Box sx={{ my: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" color="primary">
              Submit Assignment
            </Button>
            <Button variant="outlined">Save as Draft</Button>
          </Box>
        </div>
      </div>
    </>
  );
};

export default PreviewAndSubmit;
