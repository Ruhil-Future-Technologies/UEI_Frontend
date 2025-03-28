/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const PreviewAndSubmit = () => {
  const navigate = useNavigate();
  const { getData, postData } = useApi();
  const { id } = useParams();
  const student_id = localStorage.getItem('user_uuid')
  const [assignmentData, setAssignmentData] = useState<Assignment>();
  //const [todayDate, setTodayDate] = useState<Date>();
  const [remainingDays, setRemaingDays] = useState(0);
  const [document_error, setDocument_error] = useState(false);
  const [allselectedfiles, setAllSelectedfiles] = useState<File[]>([]);
  const [value, setValue] = useState("");
  const quillRef = useRef<ReactQuill | null>(null);
  const [isSubmited, setIssubmited] = useState(false);
  const [statusCheck, setStatusCheck] = useState('Pending');

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
          const dueDate = new Date(response?.data?.due_date_time);
          const today = new Date();
          const differenceInMs = dueDate.getTime() - today.getTime();
          const remainingDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
          setRemaingDays(dueDate.getTime() > today.getTime() ? remainingDays : 0)
          isAssignmentSubmitedGet(response?.data?.id);
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


  const isAssignmentSubmitedGet = (assignmentId: string) => {
    getData(`/assignment_submission/get/submissions/${student_id}`).then((response) => {
      if (response?.status) {
        const filteredAssignment = response?.data?.filter((assignment: any) => assignment?.assignment_id == assignmentId)
        console.log(filteredAssignment);
        if (filteredAssignment.length > 0) {
          if (filteredAssignment[0]?.text) setValue(filteredAssignment[0].text);
          if (filteredAssignment[0]?.file) setAllSelectedfiles(filteredAssignment[0].file)
          if (filteredAssignment[0]?.is_graded) setStatusCheck('Graded');
          if (filteredAssignment[0]?.is_submitted && !filteredAssignment[0]?.is_graded) setStatusCheck('Submitted');
          setIssubmited(true)
        } else {
          setIssubmited(false)
        }
      }
    }).catch((error) => {
      toast.error(error?.message, {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center'
      })
    })
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


  const submitAssignment = () => {

    let check=true;
    if(value==''){
    
      check=true;
    }else{
      
      check=false;
    }

    if(allselectedfiles.length!<1){
      setDocument_error(true);
      check=true;
    }else{
      check=false;
      setDocument_error(false);
    }
if(check)return;
    const formData = new FormData();

    formData.append('assignment_id', assignmentData?.id as string)
    formData.append('text', value)
    allselectedfiles.forEach((file) => {
      formData.append('file', file);
    });
    postData(`/assignment_submission/add`, formData).then((response) => {
      if (response?.status) {

        toast.success(response.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center'

        })
        navigate('/main/student/assignment')
      }
    }).catch((error) => {
      toast.error(error.message, {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center'

      })
    })
  }
  useEffect(() => {
    const editor = quillRef.current?.editor?.root;

    if (editor) {
      // Prevent Paste
      editor.addEventListener("paste", (e) => {
        e.preventDefault();
      });

      // Prevent Drag and Drop
      editor.addEventListener("drop", (e) => {
        e.preventDefault();
      });

      // Prevent Right-click Paste
      editor.addEventListener("contextmenu", (e) => {
        e.preventDefault();
      });

      // Prevent Ctrl+V
      editor.addEventListener("keydown", (e) => {
        if (e.ctrlKey && (e.key === "v" || e.key === "V")) {
          e.preventDefault();
        }
      });
    }

    return () => {
      if (editor) {
        editor.removeEventListener("paste", (e) => e.preventDefault());
        editor.removeEventListener("drop", (e) => e.preventDefault());
        editor.removeEventListener("contextmenu", (e) => e.preventDefault());
        editor.removeEventListener("keydown", (e) => {
          if (e.ctrlKey && (e.key === "v" || e.key === "V")) {
            e.preventDefault();
          }
        });
      }
    };
  }, []);
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
              <div className="d-flex align-items-center justify-content-end">
                <AccessTimeIcon />
                <span
                  className="ms-2 me-3"
                  style={{
                    color:remainingDays < 1 ? "red":remainingDays > 2 ? "green":"#FFA500",
                  }}
                >
                  Due: {assignmentData?.due_date_time}
                </span>
                <Chip label={statusCheck} color={statusCheck == 'Submitted' ? 'primary' : statusCheck == 'Graded' ? 'success' : 'error'} />
              </div>
            </div>
          </div>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" className="mt-3">
                Instructions
              </Typography>
              <ul>
                <li>
                <div dangerouslySetInnerHTML={{ __html: assignmentData?.instructions ||''}} />
                </li>
              </ul>

              <hr className="my-4" />

              <Box>
                <Typography variant="h6">Resources</Typography>
                <ul>
                  {
                    assignmentData?.file?.map((file, index) => (
                      <li key={index}> {/* Ensure a unique key */}
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
              <div className='mt-2 mb-5'>
                <ReactQuill id='text' ref={quillRef} value={value} onChange={setValue} theme="snow" style={{ height: "120px", borderRadius: "8px" }} />
              </div>
            </CardContent>
          </Card>
          {
            !isSubmited && (
              <Box sx={{ my: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="contained" color="primary" onClick={submitAssignment}>
                  Submit Assignment
                </Button>
                <Button variant="outlined">Save as Draft</Button>
              </Box>
            )
          }

        </div>
      </div>
    </>
  );
};

export default PreviewAndSubmit;
