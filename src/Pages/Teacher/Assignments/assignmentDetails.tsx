/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
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
    Checkbox,
    Box,
    Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useApi from "../../../hooks/useAPI";
import { useNavigate, useParams } from "react-router-dom";
import { Assignment } from "./CreateAssignments";
import { toast } from "react-toastify";

const students = [
    { name: "Alice Johnson", submitted: "Feb 14, 2024", status: "Submitted", grade: "85/100" },
    { name: "Bob Smith", submitted: "Feb 13, 2024", status: "Graded", grade: "85/100" },
    { name: "Carol Williams", submitted: "Feb 14, 2024", status: "Submitted", grade: "85/100" },
];



const AssignmentDetails = () => {
    const { id } = useParams();
    const {getData}=useApi();

    const nevigate=useNavigate();
    const teacher_id=localStorage.getItem('teacher_id')
  const [assignmentData, setAssignmentData] = useState<Assignment>();
    useEffect(()=>{
        getAssignmentData();
    },[])

      const getAssignmentData=()=>{
        getData(`/assignment/get/${id}`).then(async (response) => {
            if(response.status){
                setAssignmentData(response.data);
                getListOfStudnetsForAssignment(response.data.id);
                console.log(response.data)
            }
         }).catch((error)=>{
            toast.error(error?.message,{
                hideProgressBar:true,
                theme:'colored',
                position:'top-center'
            })
         })
      }

      const getListOfStudnetsForAssignment=(assignmentId:string)=>{
        getData(`/assignment_submission/get/students/${teacher_id}`).then((response)=>{
            if(response?.status){
           console.log(assignmentId)
           console.log(response?.data)
               // const filteredSubmition=response.data

            }
        })
      }
      
      const gotoPreview=()=>{
        nevigate("/teacher-dashboard/student-assignment-details/123")
      }
    return (
        <div className="main-wrapper">
            <div className="main-content">
                <Box sx={{ margin: "auto", padding: 3, background: "#f8ebff", borderRadius: 2 }}>
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight="bold">
                            Student Submissions
                        </Typography>
                        <Select size="small" defaultValue="Change Assignment">
                            <MenuItem value="Change Assignment">Change Assignment</MenuItem>
                        </Select>
                    </Box>

                    {/* Assignment Title */}
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
                        {assignmentData?.title}
                    </Typography>

                    {/* Table */}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableRow>
                                    <TableCell><strong>Student</strong></TableCell>
                                    <TableCell><strong>Submitted</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                    <TableCell><strong>Grade</strong></TableCell>
                                    <TableCell><strong>Actions</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map((student, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ fontWeight: "bold" }}>{student.name}</TableCell>
                                        <TableCell>{student.submitted}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={student.status}
                                                color={student.status === "Graded" ? "success" : "primary"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                        NA/{assignmentData?.points}
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={gotoPreview}>
                                                <VisibilityIcon />
                                            </IconButton>
                                            Preview
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
