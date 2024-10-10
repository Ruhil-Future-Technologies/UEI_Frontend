import { ChangeEvent, useEffect, useState } from "react";
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import { QUERY_KEYS_STUDENT_FEEDBACK } from "../../utils/const";
import { TextField } from "@mui/material";

interface Question {
  id: string;
  question: string;
  options: string;
  answer?: string;
}
const AddStudentFeedback = () => {
  let StudentId = localStorage.getItem("_id");
  const { getData, postData } = useApi();
  const [question, setQuestion] = useState<Question>({
    id: "",
    question: "",
    options: "",
  });
  const [options, setOptions] = useState<any>([""]);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [message, setMessage] = useState<string>("");
  const [answeredQuestions, setAnsweredQuestions] = useState<
    { question: string; answer: string }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectAnswer, setSelectAnswer] = useState<string>("");
  const [studentFlag, setStudentFlag] = useState<boolean>(true);
  const [errors, setErrors] = useState<any>({});

  // const [editFlag, setEditFlag] = useState<boolean>(false);
  const [final_list, setFinalList] = useState<any>([]);

  useEffect(() => {
    getData(`${"/feedback/list"}`).then((data) => {
      if (data.status === 200) {
        setQuestions(data.data);
        setQuestion(data.data[0]);
        setOptions(data.data[0].options);
        // .replace(/{|}/g, '').split(',')
      }
    });
    getData(`${"/feedback/student_feedback"}/${StudentId}`).then((data) => {
      if (data.status === 200) {
        if (data.data.length > 0) {
          setAnsweredQuestions(data.data);
          setStudentFlag(false);
        }
      }
    });
  }, []);
  useEffect(() => {
    let question_list: any = [];
    questions.map((question, index) => {
      answeredQuestions.map((answer: any) => {
        if (question.question == answer.question) {
          let d = {
            // question: question.question,
            // id: answer.id,
            // StudentId: answer.student_id,
            ...question,
            answer: answer.answer,
          };
          question_list.push(d);
        }
      });
    });
    setFinalList(question_list);
  }, [questions]);

  const handleSelectedOption = (id: number, value: string, question:any) => {
    setSelectAnswer((prevAnswers: any) => ({
      ...prevAnswers,
      [id]: value,
      question: question
    }));

    // Clear the error for this question if a value is selected
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      [id]: "",
    }));
    // setSelectAnswer(value);
    console.log("answer",selectAnswer);
    
  };

  const handleNextQuestion = () => {
    if (selectAnswer) {
      const updatedAnswers = [
        ...answeredQuestions.slice(0, currentQuestionIndex),
        { question: question.question, answer: selectAnswer },
        ...answeredQuestions.slice(currentQuestionIndex + 1),
      ];
      setAnsweredQuestions(updatedAnswers);

      if (currentQuestionIndex + 1 <= questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setQuestion(questions[currentQuestionIndex + 1]);
        if (currentQuestionIndex + 1 < questions.length) {
          setOptions(questions[currentQuestionIndex + 1].options);
        }
        setSelectAnswer("");
      } else {
        alert("You have reached the end of the questions");
      }
    } else {
      alert("Please select an answer before proceeding to the next question.");
    }
   
  };

  const handleBackQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setQuestion(questions[currentQuestionIndex - 1]);
      setOptions(questions[currentQuestionIndex - 1].options); //.replace(/{|}/g, '').split(',')
      const previousAnswer =
        answeredQuestions[currentQuestionIndex - 1]?.answer || "";
      setSelectAnswer(previousAnswer);
    }
   
  };

  // Validation function
  const validateForm = () => {
    const newErrors: any = {};
    questions.forEach((question: any) => {
      if (!selectAnswer[question.id]) {
        newErrors[question.id] = "This question is required.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const updatedAnswers = [
        ...answeredQuestions,
        // .slice(0, currentQuestionIndex)
        { question: "comment", answer: message },
        // ...answeredQuestions.slice(currentQuestionIndex + 1),
      ];
      setAnsweredQuestions(updatedAnswers);

      // console.log(answeredQuestions, message);
      alert("Form submitted successfully");
      // Handle submission logic here
      console.log(updatedAnswers);
      let payload = {
        student_id: StudentId,
        feedbacks: updatedAnswers,
      };
      console.log("payload====>", payload);
      postData("/feedback/student_feedback", payload)
        .then((response) => {
          console.log("Feedback submitted successfully:", response);
          if (response.status === 200) {
            toast.success("feedback sent successfully", {
              hideProgressBar: true,
              theme: "colored",
            });
          }
          setMessage("");
          setAnsweredQuestions([]);
          setCurrentQuestionIndex(0);
          setQuestion(questions[0]);
          setStudentFlag(false);
        })
        .catch((error) => {
          console.error("Error while submitting feedback:", error);
          alert("Error while submitting feedback. Please try again later.");
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
        <div className="feedback-view">
          <h3 className="text-center m-3 fst-italic">Welcome to feedback</h3>
          {currentQuestionIndex < questions.length ? (
            <div>
              <div style={{ marginTop: "40px" }}>
                <div
                  key={question.id}
                  className="card"
                  style={{ background: "#d3d3d3" }}
                >
                  <div className="p-4">
                    {questions.map((question: any, qIndex: any) => (
                      <div key={question.id}>
                        {" "}
                        <h4 className="message-bubble m-1">
                          Q.{qIndex + 1} {question.question}
                        </h4>
                        <div className="row">
                          {question?.options?.length > 0 ? (
                            question?.options.map(
                              (option: any, index: number) => (
                                <div
                                  key={index}
                                  className="col-12 col-md-6 mb-2"
                                >
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
                                          question.question
                                        )
                                      }
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`option-${index}`}
                                    >
                                      <span className="options fs-6 m-2">
                                        {option}
                                      </span>
                                    </label>
                                  </div>
                                </div>
                              )
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
                                    question.question
                                  )
                                }
                              />
                            </div>
                          )}
                          {errors[question.id] && (
                            <span style={{ color: "red" }}>
                              {errors[question.id]}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <textarea
                style={{
                  width: "70%",
                  display: "block",
                  margin: "0 auto",
                  background: "#d3d3d3",
                }}
                value={message}
                rows={10}
                className="form-control "
                placeholder="Feel free to write your opinion........... "
                onChange={handleWritenmessage}
              />
            </div>
          )}
          {/* <h4 className="text-center m-2">
            {currentQuestionIndex + 1}/{questions.length + 1}
          </h4> */}

          {/* <div className="col">
            <button
              className="btn btn-primary m-3"
              disabled={currentQuestionIndex === 0}
              onClick={handleBackQuestion}
              style={{ float: "left" }}
            >
              Back
            </button>
          </div> */}
          {/* {currentQuestionIndex + 1 < questions.length + 1 ? (
            <div className="col">
              <button
                className="btn btn-primary m-3"
                onClick={handleNextQuestion}
                style={{ float: "right" }}
                // disabled = {}
              >
                Next
              </button>
            </div>
          ) : (
          )} */}
          <div className="mt-6 align-items-center justify-content-center d-flex">
            <button className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="feedback-view">
          <h1>You have Already filled feedback.</h1>
          {final_list.map((question: any, qIndex: number) => (
            <div key={question.id}>
              {" "}
              <h4 className="message-bubble m-1">
                Q.{qIndex + 1} {question.question}
              </h4>
              <div className="row">
                {question?.options?.length > 0 ? (
                  question?.options.map((option: any, index: number) => (
                    <div key={index} className="col-12 col-md-6 mb-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`question-${question.id}`}
                          id={`option-${index}`}
                          disabled
                          value={option}
                          checked={question.answer === option}
                          // onChange={() => handleSelectedOption(option)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`option-${index}`}
                        >
                          <span className="options fs-6 m-2">{option}</span>
                        </label>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <TextField
                      label="Question *"
                      name="question"
                      value={question.answer}
                      variant="outlined"
                      // onChange={(e) =>
                      //   handleSelectedOption(question.id, e.target.value,question.question)
                      // }
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AddStudentFeedback;
