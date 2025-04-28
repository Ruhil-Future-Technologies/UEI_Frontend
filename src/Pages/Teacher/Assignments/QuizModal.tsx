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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import theme from '../../../theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
type QuizCollection = {
  [key: string]: QuizData;
};
interface QuizModalProps {
  open: boolean;
  onClose: () => void;
  quizData: QuizCollection | null;
  onSave: (data: QuizData) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({
  open,
  onClose,
  quizData,
  onSave,
}) => {
  const [currentQuizData, setCurrentQuizData] = useState<QuizCollection | null>(null);
  const [allQuestionsSelected, setAllQuestionsSelected] = useState('set_a');
  const [finalKey, setFinalKey] = useState('set_a');
  const [editableTitle, setEditableTitle] = useState('');
  const [expanded, setExpanded] = useState<number | false>(false);
  const [title_error,setTitle_error]=useState(false);
  const [select_questions,setSelect_questions]=useState(false);
  useEffect(() => {
    if (quizData) {
      setExpanded(0)
      const updatedQuizData = Object.entries(quizData || {}).reduce((acc, [key, value], index) => {
        acc[key] = {
          ...value,
          questions: value.questions.map((question) => ({
            ...question,
            selected: index === 0, // true for first set, false for others
          })),
        };
        return acc;
      }, {} as QuizCollection);
      console.log(updatedQuizData)
      setEditableTitle(updatedQuizData[0]?.title)
      setCurrentQuizData(updatedQuizData);
    }
  }, [quizData]);

  // if (!currentQuizData) {
  //   return null;
  // }

  const handleQuestionSelection = (questionIndex: number, targetKey: string, title: string) => {
    if (!currentQuizData) return;
    setEditableTitle(title)
    const updatedQuizData = Object.entries(currentQuizData || {}).reduce(
      (acc, [key, value]) => {
        acc[key] = {
          ...value,
          questions: value.questions.map((question, qIndex) => {
            if (key === targetKey && qIndex === questionIndex) {
              return { ...question, selected: !question.selected }; // Toggle selected
            } else {
              if (key === targetKey) {
                return question
              } else {
                return { ...question, selected: false };
              }

            }

          }),
        };
        return acc;
      },
      {} as QuizCollection
    );
    const totalQuestions = updatedQuizData[targetKey]?.questions?.length || 0;
    let selectedQuestions = 0;

    Object.values(updatedQuizData).forEach(set => {
      selectedQuestions += set.questions.filter(q => q.selected).length;
    });

    console.log(totalQuestions, selectedQuestions)
    if (selectedQuestions != 0 && totalQuestions == selectedQuestions) {
      setAllQuestionsSelected(targetKey);
      setFinalKey(targetKey);
    } else {
      setAllQuestionsSelected('');
    }
    setCurrentQuizData(updatedQuizData);

    //const allSelected = updatedQuestions.every((q) => q.selected);
    //setAllQuestionsSelected(questionIndex);
  };

  const handleSelectAllQuestions = (checked: any, key_val: string,title:string) => {
    if(checked){
      setEditableTitle(title)
    }else{
      setEditableTitle('')
    }
    const updatedQuizData = Object.entries(currentQuizData || {}).reduce((acc, [key, value]) => {
      acc[key] = {
        ...value,
        questions: value.questions.map((question) => {
          if (key == key_val) {
            return { ...question, selected: checked }; // Toggle selected ✅
          }
          return question;
        }),
      };

      return acc;
    }, {} as QuizCollection);
    // const updatedQuestions = currentQuizData?.questions?.map((question) => ({
    //   ...question,
    //   selected: updatedAllSelected,
    // }));
    if (allQuestionsSelected == key_val) {
      setAllQuestionsSelected('');
    } else {
      setAllQuestionsSelected(key_val);
      setFinalKey(key_val);
    }

    setCurrentQuizData(updatedQuizData);
  };

  const handleSave = () => {
    if (currentQuizData) {

      if(editableTitle==''){
        setTitle_error(true);
        return;
      }else{
        setTitle_error(false);
      }
      const selectedQuestions = currentQuizData?.[finalKey]?.questions.filter(
        (question) => question.selected
      ) || [];
      const totalMarks = selectedQuestions.reduce(
        (sum, q) => sum + Number(q.marks || 0),
        0
      );
      if(selectedQuestions.length<1){
        setSelect_questions(true);
        return;
      }else{
        setSelect_questions(false);
      }
      const filteredData: any = {
        ...currentQuizData,
        title: editableTitle,
        questions: selectedQuestions,
        points: totalMarks,
      };
      console.log(selectedQuestions, totalMarks, filteredData, currentQuizData);
      onSave(filteredData);

    }
    onClose();
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditableTitle(event.target.value);
  };

  const getTotalSelectedMarks = () => {
    if (!currentQuizData) return 0;
    const totalMarks = Object.values(currentQuizData || {}).reduce((sum, set) => {
      const selectedQuestions = set.questions.filter(q => q.selected);
      const selectedMarks = selectedQuestions.reduce(
        (qSum, q) => qSum + Number(q.marks || 0),
        0
      );
      return sum + selectedMarks;
    }, 0);

    return totalMarks;
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
      {title_error &&
           <p
           className="error-text"
           style={{ color: 'red', marginLeft:'24px' }}
         >
           <small>Title can not be empty</small>
         </p>}
      <Divider />

      <DialogContent>
        {currentQuizData &&
          Object.values(currentQuizData)?.map((set, index) => (
            <Accordion
              key={index}
              expanded={expanded === index}
              onChange={() => setExpanded(expanded === index ? false : index)}
              className="mb-3 accorbrd"
            >
              <AccordionSummary
                className="bg-light-10"
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography variant="subtitle1">{set.title}</Typography> {/* You can customize this title */}
              </AccordionSummary>

              <AccordionDetails className="p-0">
                <Box mb={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allQuestionsSelected == Object.keys(currentQuizData)[index]}
                        onChange={(e) => handleSelectAllQuestions(e.target.checked, Object.keys(currentQuizData)[index], set?.title)}
                        color="primary"
                      />
                    }
                    label="Select All Questions"
                  />
                  <Typography variant="subtitle1" color="text.secondary">
                    {set?.questions?.filter((q) => q?.selected).length} of{' '}
                    {set?.questions?.length} questions selected | Total
                    marks: {getTotalSelectedMarks()}
                  </Typography>
                </Box>

                <Stack spacing={2}>
                  {set?.questions?.map((question, questionIndex) => (
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
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box flex="1">
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Typography variant="subtitle1">
                                <strong>Question {questionIndex + 1}:</strong> {question.question}
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
                                <ListItem key={optionIndex} disablePadding sx={{ py: 0.5 }}>
                                  <ListItemText
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body2">{option}</Typography>
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

                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              <strong>Reason:</strong> {question.reason}
                            </Typography>
                          </Box>

                          <Box sx={{ ml: 2 }}>
                            <Checkbox
                              checked={!!question.selected}
                              onChange={() => handleQuestionSelection(questionIndex, Object.keys(currentQuizData)[index], set?.title)}
                              color="primary"
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
      </DialogContent>
      {select_questions &&
      <p
      className="error-text"
      style={{ color: 'red' }}
    >
      <small>Please select at least one question.</small>
    </p>}

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
