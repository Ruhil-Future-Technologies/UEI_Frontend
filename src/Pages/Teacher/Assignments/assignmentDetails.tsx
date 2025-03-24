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
import { useParams } from "react-router-dom";
import { Assignment } from "./CreateAssignments";

const students = [
    { name: "Alice Johnson", submitted: "Feb 14, 2024", status: "Submitted", grade: "85/100" },
    { name: "Bob Smith", submitted: "Feb 13, 2024", status: "Graded", grade: "85/100" },
    { name: "Carol Williams", submitted: "Feb 14, 2024", status: "Submitted", grade: "85/100" },
];



const AssignmentDetails = () => {
    const { id } = useParams();
    const {getData}=useApi();
  const [assignmentData, setAssignmentData] = useState<Assignment>();
    useEffect(()=>{
        getData(`/assignment/get/${id}`).then(async (response) => {
        if(response.status){
            setAssignmentData(response.data);
        }
     })
    },[])
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
                                               {student.grade}
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton color="primary">
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
