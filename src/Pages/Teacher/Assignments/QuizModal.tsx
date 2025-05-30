/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
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
  isEdit: boolean;
}

const QuizModal: React.FC<QuizModalProps> = ({
  open,
  onClose,
  quizData,
  onSave,
  isEdit,
}) => {
  const [currentQuizData, setCurrentQuizData] = useState<QuizData | null>(null);
  const [editableTitle, setEditableTitle] = useState<string>('');
  const [titleError, setTitleError] = useState(false);
  const [selectQuestions, setSelectQuestions] = useState(false);

  console.log({ quizData });

  useEffect(() => {
    if (quizData) {
      const updatedQuizData = {
        ...quizData,
        questions: quizData?.questions?.map((question: any) => ({
          ...question,
          selected: isEdit ? true : false,
        })),
      };

      setCurrentQuizData(updatedQuizData);
      setEditableTitle(quizData.title);
    }
  }, [quizData, isEdit]);

  const handleQuestionSelection = (questionIndex: number) => {
    if (!currentQuizData) return;

    const updatedQuizData = {
      ...currentQuizData,
      questions: currentQuizData.questions.map((question, qIndex) => {
        if (qIndex === questionIndex) {
          return { ...question, selected: !question.selected };
        }
        return question;
      }),
    };

    setCurrentQuizData(updatedQuizData);
  };

  const handleSelectAllQuestions = (checked: boolean) => {
    if (!currentQuizData) return;

    const updatedQuizData = {
      ...currentQuizData,
      questions: currentQuizData.questions.map((question) => ({
        ...question,
        selected: checked,
      })),
    };

    setCurrentQuizData(updatedQuizData);
  };

  const handleSave = () => {
    if (currentQuizData) {
      if (editableTitle === '') {
        setTitleError(true);
        return;
      } else {
        setTitleError(false);
      }

      const selectedQuestions = currentQuizData?.questions?.filter(
        (question) => question.selected,
      );

      const totalMarks = selectedQuestions.reduce(
        (sum, q) => sum + Number(q.marks || 0),
        0,
      );

      if (selectedQuestions.length < 1) {
        setSelectQuestions(true);
        return;
      } else {
        setSelectQuestions(false);
      }

      const filteredData: QuizData = {
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

    const selectedQuestions = currentQuizData?.questions?.filter(
      (q) => q.selected,
    );
    return selectedQuestions?.reduce((sum, q) => sum + Number(q.marks || 0), 0);
  };

  const getSelectedQuestionsCount = () => {
    if (!currentQuizData) return 0;
    return currentQuizData?.questions?.filter((q) => q.selected)?.length;
  };

  const isAllSelected = () => {
    if (!currentQuizData) return false;
    return currentQuizData?.questions?.every((q) => q.selected);
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
            InputLabelProps={{ shrink: true }}
          />
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {titleError && (
        <p className="error-text" style={{ color: 'red', marginLeft: '24px' }}>
          <small>Title can not be empty</small>
        </p>
      )}

      <Divider />

      <DialogContent>
        {currentQuizData && (
          <>
            <Box mb={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAllSelected()}
                    onChange={(e) => handleSelectAllQuestions(e.target.checked)}
                    color="primary"
                  />
                }
                label="Select All Questions"
              />
              <Typography variant="subtitle1" color="text.secondary">
                {getSelectedQuestionsCount()} of{' '}
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
                            label={`${question.marks} ${
                              question.marks === 1 ? 'mark' : 'marks'
                            }`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        <List dense>
                          {question.options.map((option, optionIndex) => (
                            <ListItem
                              key={optionIndex}
                              disablePadding
                              sx={{ py: 0.5 }}
                            >
                              <ListItemText
                                primary={
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
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
                          onChange={() =>
                            handleQuestionSelection(questionIndex)
                          }
                          color="primary"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </DialogContent>

      {selectQuestions && (
        <p className="error-text" style={{ color: 'red', marginLeft: '24px' }}>
          <small>Please select at least one question.</small>
        </p>
      )}

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
