/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import DoneAllIcon from '@mui/icons-material/DoneAll';
export interface GenAssignment {
  //id: string;
  //title: string;
  marks: number;
  question: string;
}

type AssignmentCollection = {
  [key: string]: GenAssignment;
};
interface Props {
  open: boolean;
  onClose: () => void;
  assignments: AssignmentCollection | null;
  onProceed: (assignmentId: GenAssignment) => void;
  title: string;
  totalQuestions: number;
  totalMarks: number;

}

const AssignmentModal: React.FC<Props> = ({
  open,
  onClose,
  assignments,
  onProceed,
  title,
  totalQuestions,
  totalMarks,
}) => {
  const [selectedAssignmentKey, setSelectedAssignmentKey] = useState<string>('');
  const [expanded, setExpanded] = useState<number | false>(false);
  const [assignmentSets, setAssignmentSets] = useState<AssignmentCollection | null>(null);
  //const [allQuestionsSelected, setAllQuestionsSelected] = useState('set_a');
  useEffect(() => {
    console.log(assignments);
    if (open && assignments) {
      setExpanded(0);
      setAssignmentSets(assignments);
      setSelectedAssignmentKey(Object.keys(assignments)[0])
    }
  }, [open, assignments]);

  const handleSelect = (key: string, index: any) => {
    setSelectedAssignmentKey(key);
    setExpanded(index);
  };

  const handleAccordionChange = (panel: number) => () => {
    setExpanded(panel);
  };

  const handleProceed = () => {
    if (assignmentSets) {
      const data = assignmentSets[selectedAssignmentKey];
      onProceed(data);
    }


  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
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
        {assignmentSets && Object.values(assignmentSets)?.map((assignment, index) => (
          <Accordion
            key={index}
            expanded={expanded == index}
            onChange={handleAccordionChange(index)}
            className="mb-3 accorbrd"
          >
            <AccordionSummary
              className="bg-light-10"
              expandIcon={<ExpandMoreIcon />}
              onClick={() => handleSelect(Object.keys(assignmentSets)[index], index)} // Click header selects radio
            >
              <Box display="flex" alignItems="center" width="100%">
                <Radio
                  checked={selectedAssignmentKey === Object.keys(assignmentSets)[index]}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent accordion toggle
                    handleSelect(Object.keys(assignmentSets)[index], index);
                  }}
                  // value={assignment.id}
                  name="assignment-radio"
                  sx={{ mr: 1 }}
                />
                <Box flexGrow={1}>
                  <Typography fontWeight={500}>{title}</Typography>
                  <Typography variant="caption">
                    {totalQuestions}{" "}
                    Questions
                  </Typography>
                </Box>
                <Typography sx={{ ml: 'auto' }}>
                  Total: {totalMarks}{" "} marks
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails className="p-0">
              {Object.values(assignment)?.length > 0 ? (
                Object.values(assignment)?.map((q, index: any) => (
                  <Box key={index}>
                    <div className="d-flex px-4 py-3 border-bottom">
                      <div className="me-auto">
                        <Typography fontWeight={600}>
                          {index + 1}. {q.question}
                        </Typography>
                        {/* <Typography className="opacity-75 mt-2 w-100">
                          {q.answer}
                        </Typography> */}
                      </div>
                      <Chip
                        label={`${q.marks} ${q.marks === 1 ? 'mark' : 'marks'}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
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
          // disabled={!selectedAssignment}
          onClick={handleProceed}
          fullWidth
        >
          <DoneAllIcon className="me-2" /> Proceed with selected assignment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignmentModal;
