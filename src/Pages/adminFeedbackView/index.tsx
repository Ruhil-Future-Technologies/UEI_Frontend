
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import useApi from '../../hooks/useAPI';
type Feedback = {
    id: number;
    created_by: string;
    question: string;
    options: string;
    created_at: string;
    updated_by: string;
    updated_at: string;
    is_active: boolean;
    is_deleted: boolean;
};
const AdminFeedbackView = () => {

    let StudentId = localStorage.getItem("_id");
    const { getData, postData } = useApi();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    // Fetch feedbacks from an API
    useEffect(() => {
        getData(`${'/feedback/'}`).then((data)=>{
            if(data.status===200){
                console.log(data.data);
                setFeedbacks(data.data);
            }
          })
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Created By</TableCell>
                        <TableCell>Question</TableCell>
                        <TableCell>Options</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated By</TableCell>
                        <TableCell>Updated At</TableCell>
                        <TableCell>Is Active</TableCell>
                        <TableCell>Is Deleted</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {feedbacks.map((feedback) => (
                        <TableRow key={feedback.id}>
                            <TableCell>{feedback.id}</TableCell>
                            <TableCell>{feedback.created_by}</TableCell>
                            <TableCell>{feedback.question}</TableCell>
                            <TableCell>{feedback.options}</TableCell>
                            <TableCell>{new Date(feedback.created_at).toLocaleString()}</TableCell>
                            <TableCell>{feedback.updated_by}</TableCell>
                            <TableCell>{new Date(feedback.updated_at).toLocaleString()}</TableCell>
                            <TableCell>{feedback.is_active ? 'Active' : 'Inactive'}</TableCell>
                            <TableCell>{feedback.is_deleted ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AdminFeedbackView;
