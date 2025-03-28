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
    ListItem,
    ListItemText,
    TextField,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScoreboardOutlinedIcon from '@mui/icons-material/ScoreboardOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useApi from '../../../hooks/useAPI';
import { Assignment } from '../../Teacher/Assignments/CreateAssignments';
import { toTitleCase } from '../../../utils/helpers';
import { toast } from 'react-toastify';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ReactQuill from "react-quill";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import "react-quill/dist/quill.snow.css";
const PreviewStudentAssignment = () => {
    const navigate = useNavigate();
    const { getData, putData } = useApi();
    const { id } = useParams();

    const assignment_id = localStorage.getItem('assignment_id')
    const [assignmentData, setAssignmentData] = useState<Assignment>();
    //const [todayDate, setTodayDate] = useState<Date>();
    const [remainingDays, setRemaingDays] = useState(0);
    const [allselectedfiles, setAllSelectedfiles] = useState<File[]>([]);
    const [value, setValue] = useState("");
    const quillRef = useRef<ReactQuill | null>(null);
    const [isSubmited, setIssubmited] = useState(false);
    const [providedPoints, setProvidedPoints] = useState(0);
    const handleBack = () => {
        navigate(-1);
    };
    useEffect(() => {
        getAssignmentData();
    }, [])


    const getAssignmentData = () => {
        try {
            getData(`/assignment/get/${assignment_id}`).then((response) => {
                if (response?.status) {
                    setAssignmentData(response?.data);
                    const dueDate = new Date(response?.due_date_time);
                    const today = new Date();
                    const differenceInMs = dueDate.getTime() - today.getTime();

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
        getData(`/assignment_submission/get/submissions/${id}`).then((response) => {
            if (response?.status) {
                const filteredAssignment = response?.data?.filter((assignment: any) => assignment?.assignment_id == assignmentId)
                console.log(filteredAssignment);
                if (filteredAssignment.length > 0) {
                    if (filteredAssignment[0]?.text) setValue(filteredAssignment[0].text);
                    if (filteredAssignment[0]?.file) setAllSelectedfiles(filteredAssignment[0].file)
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

    const handlePointChange = (event: React.ChangeEvent<
        HTMLInputElement
    >) => {
        const { value } = event.target
        setProvidedPoints(Number(value))
    }

    const submitAssignment = () => {

        const formData = new FormData();

        formData.append('assignment_id', assignmentData?.id as string)
        formData.append('text', value)
        allselectedfiles.forEach((file) => {
            formData.append('file', file);
        });
        putData(`/assignment_submission/edit/{assignment_submission_uuid}`, formData).then((response) => {
            if (response?.status) {
                toast.success(response.message, {
                    hideProgressBar: true,
                    theme: 'colored',
                    position: 'top-center'

                })
            }
        }).catch((error) => {
            toast.error(error.message, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center'

            })
        })
    }

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
                            <Typography variant="h6" className="mt-3">
                                Instructions
                            </Typography>
                            <ul>
                            <div dangerouslySetInnerHTML={{ __html: assignmentData?.instructions ||''}} />
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
                            <Typography variant="h6" className='mb-3'>Submited Work</Typography>
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
                                {allselectedfiles.length > 0 ? allselectedfiles.map((file, index) => (
                                    <ListItem
                                        className="fileslistitem"
                                        key={index}
                                    >
                                        <div className="pinwi-20">
                                            <AttachFileIcon />
                                        </div>
                                        <ListItemText primary={file.name} />
                                    </ListItem>

                                )) : (
                                    <>
                                        <InsertDriveFileIcon sx={{ fontSize: 50, color: "#999" }} />
                                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#666" }}>
                                            No Files Uploded
                                        </Typography></>
                                )}
                            </Box>
                            <div className='mt-2 mb-5'>
                                <ReactQuill ref={quillRef} value={value} onChange={setValue} theme="snow" style={{ height: "120px", borderRadius: "8px" }} />
                            </div>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" className='mb-3'>Grade Score</Typography>
                                <TextField
                                    name='points'
                                    placeholder='provide marks'
                                    value={providedPoints}
                                    sx={{ textAlign: 'center' }}
                                    type='number'
                                    onChange={handlePointChange}
                                />


                            </Box>
                        </CardContent>
                    </Card>
                    {
                        !isSubmited && (
                            <Box sx={{ my: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Button variant="contained" color="primary" onClick={submitAssignment}>
                                    Submit Assignment
                                </Button>
                            </Box>
                        )
                    }

                </div>
            </div>
        </>
    );
};

export default PreviewStudentAssignment;
