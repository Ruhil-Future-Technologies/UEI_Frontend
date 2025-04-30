/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    Typography,
    Card,
    CardContent,
    Box,
    Chip,
    ListItem,
    ListItemText,
    TextField,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useApi from '../../../hooks/useAPI';
import { Assignment } from '../../Teacher/Assignments/CreateAssignments';
import { getColor, toTitleCase } from '../../../utils/helpers';
import { toast } from 'react-toastify';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ReactQuill from "react-quill";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import "react-quill/dist/quill.snow.css";
import VerifiedIcon from '@mui/icons-material/Verified';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { QUERY_KEYS_ASSIGNMENT, QUERY_KEYS_ASSIGNMENT_SUBMISSION } from '../../../utils/const';
import { Question_andwer } from '../../Student/StudentAssignment/previewAndSubmit';
const PreviewStudentAssignment = () => {
    const navigate = useNavigate();
    const { getData } = useApi();
    const { id } = useParams();
    const assignment_id = localStorage.getItem('assignment_id')
    const [assignmentData, setAssignmentData] = useState<Assignment>(

    );
    //const [todayDate, setTodayDate] = useState<Date>();
    const [remainingDays, setRemaingDays] = useState(0);
    const [allselectedfiles, setAllSelectedfiles] = useState<any[]>([]);
    const [value, setValue] = useState("");
    const quillRef = useRef<ReactQuill | null>(null);
    const [statusCheck, setStatusCheck] = useState('Pending');
    const [availableDuration, setAvailableDuration] = useState(0);
    const [contentType, setContentType] = useState('file');
    const [question_answer, setQuestion_answer] = useState<Question_andwer[]>([{
        question: 'what is java',
        answer: '',
        marks: 2
    },
    {
        question: 'what is oops',
        answer: '',
        marks: 2
    },
    {
        question: 'what is inheritance',
        answer:'',
        marks: 2
    }
    ]);
    const handleBack = () => {
        navigate(-1);
    };
    useEffect(() => {
        getAssignmentData();
    }, [])


    const getAssignmentData = () => {
        try {
            getData(`${QUERY_KEYS_ASSIGNMENT.GET_ASSIGNMENT}${assignment_id}`).then((response) => {
                if (response?.status) {
                    setAssignmentData(response?.data);
                    const dueDate = new Date(response?.data?.due_date_time);
                    const today = new Date();
                    const differenceInMs = dueDate.getTime() - today.getTime();
                    const availableDate = new Date(response?.data?.available_from);
                    const durationDiff = dueDate.getTime() - availableDate.getTime()
                    setAvailableDuration(Math.ceil(durationDiff / (1000 * 60 * 60 * 24)))
                    // Convert milliseconds to days (1 day = 86400000 ms)
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
        getData(`${QUERY_KEYS_ASSIGNMENT_SUBMISSION.GET_ASSIGNMENT_SUBMISSION_BY_STUDENT_ID}${id}`).then((response) => {
            if (response?.status) {
                const filteredAssignment = response?.data?.filter((assignment: any) => assignment?.assignment_id == assignmentId)
                console.log(filteredAssignment);
                if (filteredAssignment.length > 0) {
                    if (filteredAssignment[0]?.description) setValue(filteredAssignment[0].description);
                    if (filteredAssignment[0]?.files) setAllSelectedfiles(filteredAssignment[0].files)
                    if (filteredAssignment[0]?.is_graded) setStatusCheck('Graded');
                    if (filteredAssignment[0]?.is_submitted && !filteredAssignment[0]?.is_graded) setStatusCheck('Submitted');
                    if (filteredAssignment[0]?.answers?.length>0)setQuestion_answer(filteredAssignment[0]?.answers);
                    if (filteredAssignment[0]?.answers?.length>0)setContentType("questions");
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

    // const handlePointChange = (event: React.ChangeEvent<
    //     HTMLInputElement
    // >) => {
    //     const { value } = event.target
    //     setProvidedPoints(Number(value))
    // }


console.log(contentType);
    return (
        <>
            <div className="main-wrapper">
                <div className="main-content">
                    <div className="page-breadcrumb d-flex align-items-center mb-3">
                        <div className="breadcrumb-title pe-3">
                            <div className="d-flex gap-1 align-items-center" role='button'> <ArrowBackIcon onClick={handleBack} className='me-1' />


                                <Link to={'/teacher-dashboard'} className="text-dark">
                                    Dashboard
                                </Link></div>

                        </div>
                        <div className="breadcrumb-title pe-3 ms-2">
                            <div className="d-flex gap-1 align-items-center" role='button'>
                                <Link to={'/teacher-dashboard/assignments'} className="text-dark">
                                    Assignments List
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
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                className="d-inline-flex align-items-center gap-2 mt-2"
                                style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            >
                                <AccessTimeIcon fontSize="small" /> Time remaining:
                                <Chip label={remainingDays + " days"} style={{ backgroundColor: getColor(remainingDays, availableDuration), color: "#fff" }} /> |
                                <ScoreboardOutlinedIcon fontSize="small" /> Points:
                                <Chip label={assignmentData?.points} color="primary" /> |
                                <TimerOffIcon fontSize="small" /> Late Submission:
                                {assignmentData?.allow_late_submission ? <VerifiedIcon style={{ color: 'green' }} /> : <HighlightOffIcon style={{ color: 'red' }} />} |
                                <PlaylistAddCheckIcon fontSize="small" /> Add in report:
                                {assignmentData?.add_to_report ? <VerifiedIcon style={{ color: 'green' }} /> : <HighlightOffIcon style={{ color: 'red' }} />}
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
                                    Due: {assignmentData?.due_date_time}
                                </span>
                                {remainingDays != 0 || assignmentData?.allow_late_submission ?
                                    <Chip label={statusCheck} color={statusCheck == 'Submitted' ? 'primary' : statusCheck == 'Graded' ? 'success' : 'error'} />
                                    : <Chip label={'Expired'} color={'error'} />

                                }
                            </div>
                        </div>
                    </div>


                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6" className="mt-3">
                                Instructions
                            </Typography>
                            <ul>
                                <div dangerouslySetInnerHTML={{ __html: assignmentData?.instructions || '' }} />
                            </ul>

                            <hr className="my-4" />

                            <Box>
                                <Typography variant="h6">Resources</Typography>
                                <ul>
                                    {
                                        assignmentData?.files?.map((file, index) => (
                                            <li  key={index}>
                                                <a target="_blank" href={file as string}>{file as string}</a>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6" className='mb-3'>Submited Work</Typography>

                            {contentType == 'questions' ? (
                                <>
                                    <Box>
                                        {question_answer.map((question_answer, index) => (
                                            <>
                                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                                    <Typography variant="subtitle1">
                                                        <strong>Question {index + 1}:</strong> {question_answer.question}
                                                    </Typography>
                                                    <Chip
                                                        label={`${question_answer.marks} ${question_answer.marks === 1 ? 'mark' : 'marks'}`}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                                <TextField
                                                    className='mb-4'
                                                    id="outlined-multiline-static"
                                                    label="Answer"
                                                    multiline
                                                    value={question_answer.answer}
                                                    rows={2}
                                                    fullWidth
                                                    disabled
                                                />
                                            </>
                                        ))
                                        }
                                    </Box>
                                </>
                            )
                                :
                                <>
                                    <Typography sx={{ marginLeft: 1, fontSize: "0.875rem", color: "gray" }}>
                                        Uploaded files
                                    </Typography>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        textAlign="center"
                                        sx={{ padding: 2, border: "1px dashed #ccc", borderRadius: 2, backgroundColor: "#f9f9f9" }}
                                    >
                                        {allselectedfiles.length > 0 ? allselectedfiles?.map((file, index) => (
                                            <ListItem
                                                className="fileslistitem"
                                                key={index}
                                            >
                                                <div className="pinwi-20">
                                                    <AttachFileIcon />
                                                </div>
                                                <a target="_blank" href={file}>
                                                    <ListItemText primary={file} />
                                                </a>

                                            </ListItem>

                                        )) : (
                                            <>
                                                <InsertDriveFileIcon sx={{ fontSize: 50, color: "#999" }} />
                                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#666" }}>
                                                    No Files Uploded
                                                </Typography></>
                                        )}
                                    </Box>
                                </>
                            }
                            <div className='mt-2 mb-5'>
                                <ReactQuill ref={quillRef} value={value} onChange={setValue} theme="snow" style={{ height: "120px", borderRadius: "8px" }} />
                            </div>

                        </CardContent>
                    </Card>

                </div>
            </div>
        </>
    );
};

export default PreviewStudentAssignment;
