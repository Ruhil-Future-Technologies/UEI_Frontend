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
  TextField,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useApi from '../../../hooks/useAPI';
import { Assignment } from '../../Teacher/Assignments/CreateAssignments';
import { convertToISTT, getColor, toTitleCase } from '../../../utils/helpers';
import { toast } from 'react-toastify';
import UploadBtn from '../../../Components/UploadBTN/UploadBtn';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ReactQuill from 'react-quill';
import VerifiedIcon from '@mui/icons-material/Verified';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import 'react-quill/dist/quill.snow.css';
import {
  QUERY_KEYS_ASSIGNMENT,
  QUERY_KEYS_ASSIGNMENT_SUBMISSION,
} from '../../../utils/const';

export interface Question_andwer {
  question: string;
  answer: string;
  marks: number;
}
const PreviewAndSubmit = () => {
  const navigate = useNavigate();
  const { getData, postData } = useApi();
  const { id } = useParams();
  const student_id = localStorage.getItem('user_uuid');
  const stud_id = localStorage.getItem('student_id');
  const [assignmentData, setAssignmentData] = useState<Assignment>();
  //const [todayDate, setTodayDate] = useState<Date>();
  const [remainingDays, setRemaingDays] = useState(0);
  const [document_error, setDocument_error] = useState(false);
  const [allselectedfiles, setAllSelectedfiles] = useState<File[]>([]);
  const [allselectedfilesToShow, setAllSelectedfilesToShow] = useState<
    string[]
  >([]);
  const [description, setDescription] = useState('');
  const quillRef = useRef<ReactQuill | null>(null);
  const [isSubmited, setIssubmited] = useState(false);
  const [statusCheck, setStatusCheck] = useState('Pending');
  const [availableDuration, setAvailableDuration] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [question_answer, setQuestion_answer] = useState<Question_andwer[]>([
    {
      question: '',
      answer: '',
      marks: 0,
    },
  ]);
  const [q_a_error, setQ_a_error] = useState(false);
  const [contentType, setContentType] = useState('file');

  const handleBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    getAssignmentData();
  }, []);

  const getAssignmentData = () => {
    try {
      getData(`${QUERY_KEYS_ASSIGNMENT.GET_ASSIGNMENT}${id}`).then(
        (response) => {
          if (response?.status) {
            setAssignmentData(response?.data);
            if (
              response?.data?.questions &&
              response?.data?.questions.length > 0
            ) {
              setQuestion_answer(response?.data?.questions);
              setContentType('questions');
            }
            const dueDate = new Date(response?.data?.due_date_time);
            const availableDate = new Date(response?.data?.available_from);
            const durationDiff = dueDate.getTime() - availableDate.getTime();
            setAvailableDuration(
              Math.ceil(durationDiff / (1000 * 60 * 60 * 24)),
            );
            const today = new Date();
            const differenceInMs = dueDate.getTime() - today.getTime();
            const remainingDays = Math.ceil(
              differenceInMs / (1000 * 60 * 60 * 24),
            );
            setRemaingDays(
              dueDate.getTime() > today.getTime() ? remainingDays : 0,
            );
            isAssignmentSubmitedGet(response?.data?.id);
          }
        },
      );
    } catch (error: any) {
      toast.error(error.message, {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
      });
    }
  };

  useEffect(() => {
    const storedMode = localStorage.getItem('isDarkMode');
    setDarkMode(storedMode === 'true');

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'isDarkMode') {
        setDarkMode(event.newValue === 'true');
      }
    };

    const handleCustomDarkModeChange = (event: CustomEvent) => {
      setDarkMode(event.detail === true);
    };

    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, [key, value]);

      if (key === 'isDarkMode') {
        setDarkMode(value === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(
      'darkModeChange',
      handleCustomDarkModeChange as EventListener,
    );

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'darkModeChange',
        handleCustomDarkModeChange as EventListener,
      );
      localStorage.setItem = originalSetItem;
    };
  }, []);

  useEffect(() => {
    const checkDarkMode = () => {
      const currentSetting = localStorage.getItem('isDarkMode') === 'true';
      if (currentSetting !== darkMode) {
        setDarkMode(currentSetting);
      }
    };

    const intervalId = setInterval(checkDarkMode, 1000);

    return () => clearInterval(intervalId);
  }, [darkMode]);

  const isAssignmentSubmitedGet = (assignmentId: string) => {
    getData(
      `${QUERY_KEYS_ASSIGNMENT_SUBMISSION.GET_ASSIGNMENT_SUBMISSION_BY_STUDENT_ID}${student_id}`,
    )
      .then((response) => {
        if (response?.status) {
          const filteredAssignment = response?.data?.filter(
            (assignment: any) => assignment?.assignment_id == assignmentId,
          );
          if (filteredAssignment.length > 0) {
            if (filteredAssignment[0]?.description)
              setDescription(filteredAssignment[0].description);
            if (filteredAssignment[0]?.files)
              setAllSelectedfilesToShow(filteredAssignment[0].files);
            if (filteredAssignment[0]?.is_graded) setStatusCheck('Graded');
            if (
              filteredAssignment[0]?.is_submitted &&
              !filteredAssignment[0]?.is_graded
            )
              setStatusCheck('Submitted');
            if (filteredAssignment[0]?.answers?.length > 0)
              setQuestion_answer(filteredAssignment[0]?.answers);
            if (filteredAssignment[0]?.answers?.length > 0)
              setContentType('questions');
            setIssubmited(true);
          } else {
            setIssubmited(false);
          }
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
    if (allselectedfiles.length == 1) {
      setDocument_error(true);
    } else {
      setDocument_error(false);
    }
  };

  const submitAssignment = () => {
    let check = false;
    // if (description == '') {

    //   check = true;
    // } else {

    //   check = false;
    // }

    if (
      contentType == 'file' &&
      allselectedfiles.length! < 1
    ) {
      setDocument_error(true);
      check = true;
    } else {
      setDocument_error(false);
    }

    if (
      contentType != 'file' &&
      question_answer.find(
        (question) => !question.answer || question.answer === '',
      )
    ) {
      setQ_a_error(true);
      check = true;
    } else {
      setQ_a_error(false);
    }
    if (check) return;
    const formData: any = new FormData();

    formData.append('assignment_id', assignmentData?.id as string);
    formData.append('student_id', stud_id as string);
    formData.append('description', description);
    formData.append('questions', JSON.stringify(question_answer));
    allselectedfiles.forEach((file) => {
      formData.append('files', file);
    });
    // const paylod = {
    //   assignment_id: assignmentData?.id,
    //   student_id: stud_id,
    //   description: 'test',
    //   questions: question_answer
    // }
    postData(
      `${QUERY_KEYS_ASSIGNMENT_SUBMISSION.ADD_ASSIGNMENT_SUBMISSION}`,
      formData,
    )
      .then((response) => {
        if (response?.status) {
          toast.success(response.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
          navigate('/main/student/assignment');
        } else {
          toast.error(response.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        }
      })
      .catch((error) => {
        toast.error(error.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
  };
  const handleAnswer = (value: any, index: any) => {
    setQuestion_answer((prev) => {
      const updateobj = [...prev];
      updateobj[index] = { ...updateobj[index], answer: value };
      return updateobj;
    });
    if (
      question_answer.find(
        (question) => question.answer || question.answer !== '',
      )
    ) {
      setQ_a_error(false);
    }
  };
  useEffect(() => {
    const editor = quillRef.current?.editor?.root;

    if (editor) {
      // Prevent Paste
      editor.addEventListener('paste', (e) => {
        e.preventDefault();
      });

      // Prevent Drag and Drop
      editor.addEventListener('drop', (e) => {
        e.preventDefault();
      });

      // Prevent Right-click Paste
      editor.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });

      // Prevent Ctrl+V
      editor.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
          e.preventDefault();
        }
      });
    }

    return () => {
      if (editor) {
        editor.removeEventListener('paste', (e) => e.preventDefault());
        editor.removeEventListener('drop', (e) => e.preventDefault());
        editor.removeEventListener('contextmenu', (e) => e.preventDefault());
        editor.removeEventListener('keydown', (e) => {
          if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
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
              <div className="d-flex gap-1 align-items-center" role="button">
                {' '}
                <ArrowBackIcon onClick={handleBack} className="me-1" />
                <Link to={'/main/dashboard'} className="text-dark">
                  Dashboard
                </Link>
              </div>
            </div>
            <div className="breadcrumb-title pe-3 ms-2">
              <div className="d-flex gap-1 align-items-center" role="button">
                <Link to={'/main/student/assignment'} className="text-dark">
                  Assignments List
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
          <div className="row g-2">
            <div className="col-lg-7">
              <Typography variant="h4" fontWeight="bold">
                {toTitleCase(assignmentData?.title || '')}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                className="d-inline-flex align-items-center gap-2 mt-2"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <AccessTimeIcon fontSize="small" /> Time remaining:
                <Chip
                  label={remainingDays + ' days'}
                  style={{
                    backgroundColor: getColor(remainingDays, availableDuration),
                    color: '#fff',
                  }}
                />{' '}
                |
                <ScoreboardOutlinedIcon fontSize="small" /> Points:
                <Chip label={assignmentData?.points} color="primary" /> |
                <TimerOffIcon fontSize="small" /> Late Submission:
                {assignmentData?.allow_late_submission ? (
                  <VerifiedIcon style={{ color: 'green' }} />
                ) : (
                  <HighlightOffIcon style={{ color: 'red' }} />
                )}{' '}
                |
                <PlaylistAddCheckIcon fontSize="small" /> Add in report:
                {assignmentData?.add_to_report ? (
                  <VerifiedIcon style={{ color: 'green' }} />
                ) : (
                  <HighlightOffIcon style={{ color: 'red' }} />
                )}
              </Typography>
            </div>
            <div className="col-lg-5">
              <div className="d-flex align-items-center justify-content-end">
                <AccessTimeIcon />
                <span
                  className="ms-2 me-3"
                  style={{
                    color: getColor(remainingDays, availableDuration),
                  }}
                >
                  Due: {convertToISTT(assignmentData?.due_date_time as string)}
                </span>
                {remainingDays != 0 || assignmentData?.allow_late_submission ? (
                  <Chip
                    label={statusCheck}
                    color={
                      statusCheck == 'Submitted'
                        ? 'primary'
                        : statusCheck == 'Graded'
                          ? 'success'
                          : 'error'
                    }
                  />
                ) : (
                  <Chip label={'Expired'} color={'error'} />
                )}
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
                  <div
                    dangerouslySetInnerHTML={{
                      __html: assignmentData?.instructions || '',
                    }}
                  />
                </li>
              </ul>

              <hr className="my-4" />

              <Box>
                <Typography variant="h6">Resources</Typography>
                <ul>
                  {assignmentData?.files?.map((file, index) => (
                    <li
                      key={index}
                      className="d-flex justify-content-between me-5"
                    >
                      {' '}
                      {/* Ensure a unique key */}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={file as string}
                      >
                        {file as string}
                      </a>
                      <a
                        href={file as string}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GetAppOutlinedIcon />
                      </a>
                    </li>
                  ))}
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
              <Typography variant="h6" className="mb-3">
                Submit Your Work
              </Typography>

              {contentType == 'questions' ? (
                <>
                  <Box>
                    {question_answer.map((question_answer, index) => (
                      <>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Typography
                            variant="subtitle1"
                            onCopy={(e) => e.preventDefault()}
                            onCut={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            onContextMenu={(e) => e.preventDefault()} // disables right-click
                            style={{ userSelect: 'none' }}
                          >
                            <strong>Question {index + 1}:</strong>{' '}
                            {question_answer.question}
                          </Typography>
                          <Chip
                            label={`${question_answer.marks} ${question_answer.marks === 1 ? 'mark' : 'marks'}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        <TextField
                          className="mb-4"
                          id="outlined-multiline-static"
                          label="Answer"
                          multiline
                          InputLabelProps={{ shrink: true }}
                          value={question_answer.answer}
                          rows={2}
                          fullWidth
                          onChange={(e) => handleAnswer(e.target.value, index)}
                          onCopy={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onPaste={(e) => e.preventDefault()}
                        />
                      </>
                    ))}
                  </Box>
                </>
              ) : (
                <>
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
                </>
              )}

              {statusCheck == 'Pending'
                ? allselectedfiles.map((file, index) => (
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
                  ))
                : allselectedfilesToShow.map((file, index) => (
                    <ListItem className="fileslistitem" key={index}>
                      <div className="pinwi-20">
                        <AttachFileIcon />
                      </div>
                      <a
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        href={file}
                      >
                        <ListItemText primary={file} />
                      </a>
                    </ListItem>
                  ))}

              {document_error && (
                <p className="error-text " style={{ color: 'red' }}>
                  <small> Please add at least one file.</small>
                </p>
              )}
              {q_a_error && (
                <p className="error-text " style={{ color: 'red' }}>
                  <small>All questions are required</small>
                </p>
              )}
              <div className="mt-2 mb-5">
                <ReactQuill
                  id="text"
                  ref={quillRef}
                  value={description}
                  onChange={setDescription}
                  theme="snow"
                  style={{ height: '120px', borderRadius: '8px' }}
                  className={darkMode ? 'quill-dark' : ''}
                />
              </div>
            </CardContent>
          </Card>
          {!isSubmited &&
            (remainingDays == 0
              ? assignmentData?.allow_late_submission
              : true) && (
              <Box
                sx={{
                  my: 3,
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitAssignment}
                >
                  Submit Assignment
                </Button>
                <Button variant="outlined">Save as Draft</Button>
              </Box>
            )}
        </div>
      </div>
    </>
  );
};

export default PreviewAndSubmit;
