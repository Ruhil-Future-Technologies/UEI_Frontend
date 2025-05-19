/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TextField } from '@mui/material';
import useApi from '../../../hooks/useAPI';
import ThemeSidebar from '../../../Components/ThemeSidebar/ThemeSidebar';
import { QUERY_KEYS_FEEDBACK, QUERY_KEYS_TEACHER_FEEDBACK } from '../../../utils/const';

// import CommonModal from '../../Components/CommonModal';


interface Question {
  id: string;
  question: string;
  options: string;
  answer?: string;
}
const TeacherFeedback = () => {
  const TeacherId = localStorage.getItem('teacher_id');
  const { getData, postDataJson } = useApi();

  const [questions, setQuestions] = useState<Question[]>([]);

  const [message, setMessage] = useState<string>('');
  const [answeredQuestions, setAnsweredQuestions] = useState<
    { question: string; answer: string }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectAnswer, setSelectAnswer] = useState<string>('');
  const [studentFlag, setStudentFlag] = useState<boolean>(true);
  const [errors, setErrors] = useState<any>({});
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<string>('');

  const [finalList, setFinalList] = useState<any>([]);

  useEffect(() => {
    const newTheme = localStorage.getItem('theme');
    setThemeMode(newTheme || 'light');
  }, []);

  useEffect(() => {
    getData(`${QUERY_KEYS_FEEDBACK.GET_FEEDBACK}`).then((data) => {
      if (data.status) {
        setQuestions(data.data?.feedbacks?.teacher);
      }
    });
    getData(`${QUERY_KEYS_TEACHER_FEEDBACK.FEEDBACK_EDIT}${TeacherId}`).then((data) => {
      if (data.status) {
        if (data.data.feedbacks_data.length > 0) {
          setAnsweredQuestions(data?.data?.feedbacks_data);
          setStudentFlag(false);
          // setIsOpen(true);
        }
      }
    });
  }, [studentFlag]);

  useEffect(() => {
    const question_list: any = [];
    questions.map((question) => {
      answeredQuestions.map((answer: any) => {
        if (question.question === answer.question) {
          const d = {
            ...question,
            answer: answer.answer,
          };
          question_list.push(d);
        }
      });
    });

    setFinalList(question_list);
  }, [questions]);

  useEffect(() => {
    if (selectAnswer) {
      const newValue: any = [];
      questions.forEach((question: any) => {
        if (selectAnswer[question.id]) {
          newValue.push({
            question: question.question,
            answer: selectAnswer[question.id],
          });
        }
      });
      setAnsweredQuestions(newValue);
    }
  }, [selectAnswer]);

  const handleSelectedOption = (id: number, value: string, question: any) => {
    setSelectAnswer((prevAnswers: any) => ({
      ...prevAnswers,
      [id]: value,
      question: question,
      answer: value,
    }));
    // Clear the error htmlFor this question if a value is selected
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [id]: '',
    }));
    // setSelectAnswer(value);
  };

  // Validation function
  const validateForm = () => {
    const newErrors: any = {};
    questions.forEach((question: any) => {
      if (!selectAnswer[question.id]) {
        newErrors[question.id] = 'This Question is required.';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const formData = new FormData();
    if (validateForm()) {
      const updatedAnswers = [
        ...answeredQuestions,
        // .slice(0, currentQuestionIndex)
        { question: 'comment', answer: message },
        // ...answeredQuestions.slice(currentQuestionIndex + 1),
      ];
      setAnsweredQuestions(updatedAnswers);

      const payload = {
        teacher_id: TeacherId,
        feedbacks: updatedAnswers,
      } as any;
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });
       postDataJson(QUERY_KEYS_TEACHER_FEEDBACK.FEEDBACK_ADD, payload)
        .then((response) => {
          if (response.status) {
            toast.success('Feedback sent successfully', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
          }
          setMessage('');
          setAnsweredQuestions([]);
          setCurrentQuestionIndex(0);
          // setQuestion(questions[0]);
          setStudentFlag(false);
        })
        .catch((error) => {
          console.error('Error while submitting feedback:', error);
          alert('Error while submitting feedback. Please try again later.');
        });
    }
  };

  const handleWritenmessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };
  return (
    <>
      {studentFlag ? (
        <>
          <div className="main-wrapper mb-4">
            <div className="main-content">
              <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Feedback</div>
                <div className="ps-3">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 p-0">
                      <li className="breadcrumb-item">
                        <a href="">
                          <i className="bx bx-home-alt"></i>
                        </a>
                      </li>
                      {/* <li className="breadcrumb-item" aria-current="page">Submit Feedback</li> */}
                      <li aria-current="page">Submit Feedback</li>
                    </ol>
                  </nav>
                </div>
              </div>
              <div className="feedback">
                <h1>Give Your Valuable Feedback</h1>
                <div className="feedback-questions">
                  {currentQuestionIndex < questions.length ? (
                    <>
                      {questions.map((question: any) => (
                        <div className="question" key={question.id}>
                          <label htmlFor="" className="top-label">
                            {' '}
                            {question.question}
                          </label>
                          <div className="row g-2">
                            {question?.options?.length > 0 ? (
                              JSON.parse(question?.options || "[]").map(
                                (option: any, index: number) => (
                                  <div className="col-lg-6" key={index}>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name={`question-${question.id}`}
                                        id={`option-${index}`}
                                        value={option}
                                        checked={
                                          selectAnswer[question.id] === option
                                        }
                                        onChange={() =>
                                          handleSelectedOption(
                                            question.id,
                                            option,
                                            question.question,
                                          )
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`option-${index}`}
                                      >
                                        {option}
                                      </label>
                                    </div>
                                  </div>
                                ),
                              )
                            ) : (
                              <div>
                                <TextField
                                  label="Question *"
                                  name="question"
                                  value={question.answer}
                                  variant="outlined"
                                  onChange={(e) =>
                                    handleSelectedOption(
                                      question.id,
                                      e.target.value,
                                      question.question,
                                    )
                                  }
                                />
                              </div>
                            )}
                            {errors[question.id] && (
                              <span style={{ color: 'red' }}>
                                {errors[question.id]}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div>
                      <textarea
                        style={{
                          width: '70%',
                          display: 'block',
                          margin: '0 auto',
                          background: '#d3d3d3',
                        }}
                        value={message}
                        rows={10}
                        className="form-control "
                        placeholder="Feel free to write your opinion........... "
                        onChange={handleWritenmessage}
                      />
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-primary mt-4 mx-auto d-block rounded-pill px-4 mb-4"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="main-wrapper mb-4">
            <div className="main-content">
              <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Feedback</div>
                <div className="ps-3">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 p-0">
                      <li className="breadcrumb-item">
                        <a href="">
                          <i className="bx bx-home-alt"></i>
                        </a>
                      </li>
                      {/* <li className="breadcrumb-item" aria-current="page">Submit Feedback</li> */}
                      <li aria-current="page">Submit Feedback</li>
                    </ol>
                  </nav>
                </div>
              </div>
              <div className="feedback">
                <h1>You have already submitted your feedback.</h1>
                <div className="feedback-questions">
                  {
                    <>
                      {finalList.map((question: any) => (
                        <div className="question" key={question.id}>
                          <label htmlFor="" className="top-label">
                            {' '}
                            {question.question}
                          </label>
                          <div className="row g-2">
                            {question?.options?.length > 0 ? (
                              JSON.parse(question?.options || "[]").map(
                                (option: any, index: number) => (
                                  <div className="col-lg-6" key={index}>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name={`question-${question.id}`}
                                        id={`option-${index}`}
                                        value={option}
                                        checked={question.answer === option}
                                        onChange={() =>
                                          handleSelectedOption(
                                            question.id,
                                            option,
                                            question.question,
                                          )
                                        }
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor={`option-${index}`}
                                      >
                                        {option}
                                      </label>
                                    </div>
                                  </div>
                                ),
                              )
                            ) : (
                              <div>
                                <TextField
                                  label="Question *"
                                  name="question"
                                  value={question.answer}
                                  variant="outlined"
                                  onChange={(e) =>
                                    handleSelectedOption(
                                      question.id,
                                      e.target.value,
                                      question.question,
                                    )
                                  }
                                />
                              </div>
                            )}
                            {errors[question.id] && (
                              <span style={{ color: 'red' }}>
                                {errors[question.id]}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
          {/* <CommonModal
            message={'You have successfully submitted your Feedback.'}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          /> */}
        </>
      )}

      <ThemeSidebar themeMode={themeMode} setThemeMode={setThemeMode} />
    </>
  );
};

export default TeacherFeedback;
