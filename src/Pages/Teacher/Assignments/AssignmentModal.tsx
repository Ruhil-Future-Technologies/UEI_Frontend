import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import DoneAllIcon from '@mui/icons-material/DoneAll';
interface Assignment {
  id: string;
  title: string;
  questions: number;
  totalMarks: number;
  questionsList: { question: string; answer: string; marks: number }[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  assignments: Assignment[];
  onProceed: (assignmentId: string) => void;
}

const AssignmentModal: React.FC<Props> = ({
  open,
  onClose,
  assignments,
  onProceed,
}) => {
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    if (open && assignments.length > 0) {
      setExpanded(assignments[0].id);
    }
  }, [open, assignments]);

  const handleSelect = (id: string) => {
    setSelectedAssignment(id);
    setExpanded(id);
  };

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleProceed = () => {
    if (selectedAssignment) onProceed(selectedAssignment);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        className="border-bottom mb-4"
      >
        <div>
          Preview Assignments
          <Typography variant="body2" mb={0}>
            Select one assignment to process
          </Typography>
        </div>

        <IconButton className="btn btn-secondary text-white">
          <RefreshIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {assignments.map((assignment) => (
          <Accordion
            key={assignment.id}
            expanded={expanded === assignment.id}
            onChange={handleAccordionChange(assignment.id)}
            className="mb-3 accorbrd"
          >
            <AccordionSummary
              className="bg-light-10"
              expandIcon={<ExpandMoreIcon />}
              onClick={() => handleSelect(assignment.id)} // Click header selects radio
            >
              <Box display="flex" alignItems="center" width="100%">
                <Radio
                  checked={selectedAssignment === assignment.id}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent accordion toggle
                    handleSelect(assignment.id);
                  }}
                  value={assignment.id}
                  name="assignment-radio"
                  sx={{ mr: 1 }}
                />
                <Box flexGrow={1}>
                  <Typography fontWeight={500}>{assignment.title}</Typography>
                  <Typography variant="caption">
                    {assignment.questions} Questions
                  </Typography>
                </Box>
                <Typography sx={{ ml: 'auto' }}>
                  Total: {assignment.totalMarks} marks
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails className="p-0">
              {assignment.questionsList.length > 0 ? (
                assignment.questionsList.map((q, index) => (
                  <Box key={index}>
                    <div className="d-flex px-4 py-3 border-bottom">
                      <div className="me-auto">
                        <Typography fontWeight={600}>
                          {index + 1}. {q.question}
                        </Typography>
                        <Typography className="opacity-75 mt-2 w-100">
                          {q.answer}
                        </Typography>
                      </div>

                      <Typography variant="caption" color="text.secondary">
                        {q.marks} marks
                      </Typography>
                    </div>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No preview available.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </DialogContent>

      {/* ✅ Fixed Footer */}
      <DialogActions
        sx={{ flexDirection: 'column', alignItems: 'center', gap: 1, p: 2 }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: '30px', px: 4, py: 1.5 }}
          disabled={!selectedAssignment}
          onClick={handleProceed}
          fullWidth
        >
          <DoneAllIcon className="me-2" /> Proceed with selected assignment
        </Button>
        <Typography
          variant="caption"
          sx={{ cursor: 'pointer', color: 'text.secondary' }}
          onClick={() => {
            console.log('Save as draft clicked');
            onClose(); // optional: close on draft
          }}
        >
          Save as draft
        </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentModal;
