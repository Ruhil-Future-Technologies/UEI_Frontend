/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Modal, Box, Checkbox, FormControlLabel, Paper, List, ListItem, ListItemText, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const students = ["Amit Sharma", "Priya Verma", "Rajesh Kumar", "Sneha Patil", "Vikram Singh", "Pooja Iyer", "Arjun Nair", "Neha Joshi"];
interface StudentSelectionPopupProps {
    open: boolean;
    onClose: () => void;
}
const StudentSelectionPopup: React.FC<StudentSelectionPopupProps> = ({ open, onClose }) => {
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const allSelected = students.length > 0 && selectedStudents.length === students.length;

    const handleToggleAll = () => {
        setSelectedStudents(allSelected ? [] : students);
    };

    const handleToggleStudent = (student: string) => {
        setSelectedStudents((prevSelected) =>
            prevSelected.includes(student) ? prevSelected.filter((s) => s !== student) : [...prevSelected, student]
        );
    };

    return (
        <Modal open={open} onClose={onClose} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ width: "50%", bgcolor: "white", p: 3, borderRadius: 2, boxShadow: 24, position: "relative" }}>
                {/* Close Button */}
                <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8 }}>
                    <CloseIcon />
                </IconButton>
                <Paper sx={{ maxHeight: 300, overflowY: "auto", p: 2 }}>
                    <FormControlLabel
                        control={<Checkbox checked={allSelected} onChange={handleToggleAll} />}
                        label="Select All"
                    />
                    <List>
                        {students.map((student) => (
                             <ListItem key={student} sx={{ display: "flex", alignItems: "center" }}>
                                <Checkbox checked={selectedStudents.includes(student)} onChange={() => handleToggleStudent(student)} />
                                <ListItemText primary={student} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>
        </Modal>
    );
};

export default StudentSelectionPopup;
