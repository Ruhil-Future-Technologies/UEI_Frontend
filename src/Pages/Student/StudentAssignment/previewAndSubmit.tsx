import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PreviewAndSubmit = () => {
  const navigate  = useNavigate();

  const handleBack = () => {
    navigate(-1); // navigates to the previous page
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
            Final Project: E-commerce Website
          </Typography>
          <Typography variant="body2" color="text.secondary" className='d-inline-flex align-items-center gap-1 mt-2'>
            <AccessTimeIcon fontSize='small'/> Time remaining: 5 days | <ScoreboardOutlinedIcon fontSize='small' />Points: 100
          </Typography>
            </div>
            <div className="col-lg-5">
              <div className="d-flex align-items-center justify-content-end"><AccessTimeIcon /> <span className='text-danger ms-2 me-3'> Due: December 15, 2025, 11:59PM</span><Chip label="Pending" color="warning"  /> </div>
              
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
                Requirement
              </Typography>
              <ul>
                <li>Responsive design for all screen sizes</li>
                <li>Product listing with filtering and sorting</li>
                <li>Shopping cart functionality</li>
                <li>User authentication system</li>
                <li>Checkout process with payment integration</li>
              </ul>

              <hr className="my-4" />

              <Box>
                <Typography variant="h6">Resources</Typography>
                <ul>
                  <li>
                    <a href="#">Project Requirements Document.pdf</a>
                  </li>
                  <li>
                    <a href="#">API Documentation.pdf</a>
                  </li>
                  <li>
                    <a href="#">Design Guidelines.pdf</a>
                  </li>
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
                    <Button variant="contained" sx={{ mt: 2 }}>
                      Choose Files
                    </Button>
                  </Box>
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
              <TableContainer  sx={{ mt: 2 }}>
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
