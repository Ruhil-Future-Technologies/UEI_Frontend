/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Stack,
  Divider,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import theme from '../../../theme';

interface Question {
  question: string;
  options: string[];
  answer: string;
  reason: string;
  marks: number;
  selected?: boolean;
}

interface QuizData {
  title: string;
  questions: Question[];
  [key: string]: any;
}

interface QuizModalProps {
  open: boolean;
  onClose: () => void;
  quizData: QuizData | null;
  onSave: (data: QuizData) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({
  open,
  onClose,
  quizData,
  onSave,
}) => {
  const [currentQuizData, setCurrentQuizData] = useState<QuizData | null>(null);
  const [allQuestionsSelected, setAllQuestionsSelected] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');

  useEffect(() => {
    if (quizData) {
      const initializedData = {
        ...quizData,
        questions: quizData?.questions?.map((q) => ({
          ...q,
          selected: false,
        })),
      };
      setCurrentQuizData(initializedData);
      setEditableTitle(quizData.title || '');
    }
  }, [quizData]);

  if (!currentQuizData) {
    return null;
  }

  const handleQuestionSelection = (questionIndex: number) => {
    if (!currentQuizData) return;

    const updatedQuestions = [...currentQuizData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      selected: !updatedQuestions[questionIndex].selected,
    };
    const selectedQuestions = currentQuizData?.questions?.filter(
      (q) => q.selected,
    );
    const totalMarks = selectedQuestions.reduce(
      (sum, q) => sum + (q.marks || 0),
      0,
    );

    setCurrentQuizData({
      ...currentQuizData,
      questions: updatedQuestions,
      points: totalMarks,
    });

    const allSelected = updatedQuestions.every((q) => q.selected);
    setAllQuestionsSelected(allSelected);
  };

  const handleSelectAllQuestions = () => {
    if (!currentQuizData) return;

    const selectedQuestions = currentQuizData?.questions?.filter(
      (q) => q.selected,
    );
    const totalMarks = selectedQuestions.reduce(
      (sum, q) => sum + (q.marks || 0),
      0,
    );

    const updatedAllSelected = !allQuestionsSelected;
    setAllQuestionsSelected(updatedAllSelected);

    const updatedQuestions = currentQuizData?.questions?.map((question) => ({
      ...question,
      selected: updatedAllSelected,
    }));

    setCurrentQuizData({
      ...currentQuizData,
      questions: updatedQuestions,
      points: totalMarks,
    });
  };

  const handleSave = () => {
    if (currentQuizData) {
      const selectedQuestions = currentQuizData.questions
        .filter((q) => q.selected)
        .map((question) => {
          const questionCopy = { ...question };
          delete questionCopy.selected;
          return questionCopy;
        });

      const totalMarks = selectedQuestions.reduce(
        (sum, q) => sum + (q.marks || 0),
        0,
      );

      const filteredData: any = {
        ...currentQuizData,
        title: editableTitle,
        questions: selectedQuestions,
        points: totalMarks,
      };

      onSave(filteredData);
    }
    onClose();
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTitle(event.target.value);
  };

  const getTotalSelectedMarks = () => {
    if (!currentQuizData) return 0;
    return currentQuizData?.questions
      ?.filter((q) => q.selected)
      .reduce((sum, q) => sum + (q.marks || 0), 0);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <TextField
            value={editableTitle}
            onChange={handleTitleChange}
            label="Quiz Title"
            variant="outlined"
            size="small"
            fullWidth
            sx={{ maxWidth: '70%', marginTop: '10px' }}
          />
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box mb={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={allQuestionsSelected}
                onChange={handleSelectAllQuestions}
                color="primary"
              />
            }
            label="Select All Questions"
          />
          <Typography variant="subtitle1" color="text.secondary">
            {currentQuizData?.questions?.filter((q) => q?.selected).length} of{' '}
            {currentQuizData?.questions?.length} questions selected | Total
            marks: {getTotalSelectedMarks()}
          </Typography>
        </Box>

        <Stack spacing={2}>
          {currentQuizData?.questions?.map((question, questionIndex) => (
            <Card
              key={questionIndex}
              variant="outlined"
              sx={{
                borderColor: question.selected
                  ? theme.palette.primary.main
                  : '#e0e0e0',
                borderRadius: '10px',
                borderWidth: '2px',
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box flex="1">
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="subtitle1">
                        <strong>Question {questionIndex + 1}:</strong>{' '}
                        {question.question}
                      </Typography>
                      <Chip
                        label={`${question.marks} ${question.marks === 1 ? 'mark' : 'marks'}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    <List dense>
                      {question?.options.map((option, optionIndex) => (
                        <ListItem
                          key={optionIndex}
                          disablePadding
                          sx={{ py: 0.5 }}
                        >
                          <ListItemText
                            primary={
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <Typography variant="body2">
                                  {option}
                                </Typography>
                                {option === question.answer && (
                                  <CheckCircleIcon
                                    color="success"
                                    fontSize="small"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: 'block' }}
                    >
                      <strong>Reason:</strong> {question.reason}
                    </Typography>
                  </Box>

                  <Box sx={{ ml: 2 }}>
                    <Checkbox
                      checked={!!question.selected}
                      onChange={() => handleQuestionSelection(questionIndex)}
                      color="primary"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleSave} color="primary" variant="contained">
          Submit
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizModal;
