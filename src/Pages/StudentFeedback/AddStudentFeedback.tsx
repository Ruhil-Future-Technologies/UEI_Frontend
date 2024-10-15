import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TextField } from "@mui/material";
import { QUERY_KEYS_STUDENT_FEEDBACK } from "../../utils/const";
import useApi from "../../hooks/useAPI";
import CommonModal from "../../Components/CommonModal";
import ThemeSidebar from "../../Components/ThemeSidebar/ThemeSidebar";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<string>("");

  // const [editFlag, setEditFlag] = useState<boolean>(false);
  const [finalList, setFinalList] = useState<any>([]);

  useEffect(() => {
    const newTheme = localStorage.getItem("theme");
    setThemeMode(newTheme || "light");
  }, [])

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
          setIsOpen(true);
        }
      }
    });
  }, [studentFlag]);

  useEffect(() => {
    let question_list: any = [];
    questions.map((question, index) => {
      answeredQuestions.map((answer: any) => {
        if (question.question === answer.question) {
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

  useEffect(() => {
    if (selectAnswer) {
      let newValue: any = [];
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
      [id]: "",
    }));
    // setSelectAnswer(value);
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

      // alert("Form submitted successfully");
      // console.log(answeredQuestions, message);
      // Handle submission logic here
      let payload = {
        student_id: Number(StudentId),
        feedbacks: updatedAnswers,
      };
      postData("/feedback/student_feedback", payload)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Feedback sent successfully", {
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
        <>
          {/* <div className="feedback-view">
            <h3 className="text-center m-3 fst-italic">
              Give Your Valuable Feedback
            </h3>
            {currentQuestionIndex < questions.length ? (
              <div>
                <div>
                  <div
                    key={question.id}
                    className="card"
                    style={{ background: "#d3d3d3" }}
                  >
                    <div className="p-4">
                      {questions.map((question: any, qIndex: any) => (
                        <div key={question.id}>
                          {" "}
                          <h5 className="my-3" style={{ fontWeight: "bolder" }}>
                            Q.{qIndex + 1} {question.question}
                          </h5>
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
            <div className="mt-6 align-items-center justify-content-center d-flex mt-4">
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div> */}
          <div className="main-wrapper mb-4">
            <div className="main-content">
              <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Feedback</div>
                <div className="ps-3">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 p-0">
                      <li className="breadcrumb-item"><a href=""><i className="bx bx-home-alt"></i></a>
                      </li>
                      {/* <li className="breadcrumb-item" aria-current="page">Submit Feedback</li> */}
                      <li aria-current="page">Submit Feedback</li>
                    </ol>
                  </nav>
                </div>
                {/* <div className="ms-auto">
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-outline-primary rounded-pill px-lg-4"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#staticBackdrop"
                    >
                      Settings
                    </button>
                  </div>
                </div> */}
              </div>
              <div className="feedback">
                <h1>Give Your Valuable Feedback</h1>
                <div className="feedback-questions">
                  {currentQuestionIndex < questions.length ? (
                    <>
                      {questions.map((question: any, qIndex: any) => (
                        <div className="question" key={question.id}>
                          <label htmlFor="" className="top-label"> {question.question}</label>
                          <div className="row g-2">
                            {question?.options?.length > 0 ? (
                              question?.options.map(
                                (option: any, index: number) => (
                                  <div className="col-lg-6" key={index}>
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name={`question-${question.id}`}
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
                                        } />
                                      <label className="form-check-label" htmlFor={`option-${index}`}>
                                        {option}
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
                    </>
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
                </div>
                <button className="btn btn-primary mt-4 mx-auto d-block rounded-pill px-4 mb-4" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* {finalList.map((question: any, qIndex: number) => (
            <div key={question.id}>
              {" "}
              <h5 className="my-3">
                Q.{qIndex + 1} {question.question}
              </h5>
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
          ))} */}

          <div className="main-wrapper mb-4">
            <div className="main-content">
              <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                <div className="breadcrumb-title pe-3">Feedback</div>
                <div className="ps-3">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0 p-0">
                      <li className="breadcrumb-item"><a href=""><i className="bx bx-home-alt"></i></a>
                      </li>
                      {/* <li className="breadcrumb-item" aria-current="page">Submit Feedback</li> */}
                      <li aria-current="page">Submit Feedback</li>
                    </ol>
                  </nav>
                </div>
                {/* <div className="ms-auto">
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-outline-primary rounded-pill px-lg-4"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#staticBackdrop"
                    >
                      Settings
                    </button>
                  </div>
                </div> */}
              </div>
              <div className="feedback">
                <h1>You have already submitted your feedback</h1>
                <div className="feedback-questions">
                  {(
                    <>
                      {finalList.map((question: any, qIndex: any) => (
                        <div className="question" key={question.id}>
                          <label htmlFor="" className="top-label"> {question.question}</label>
                          <div className="row g-2">
                            {question?.options?.length > 0 ? (
                              question?.options.map(
                                (option: any, index: number) => (
                                  <div className="col-lg-6" key={index}>
                                    <div className="form-check">
                                      <input className="form-check-input" type="radio" name={`question-${question.id}`}
                                        id={`option-${index}`}
                                        value={option}
                                        checked={question.answer === option}
                                        onChange={() =>
                                          handleSelectedOption(
                                            question.id,
                                            option,
                                            question.question
                                          )
                                        } />
                                      <label className="form-check-label" htmlFor={`option-${index}`}>
                                        {option}
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <CommonModal
            message={"You have already submitted your feedback."}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </>
      )}
      {/* <div
        className="offcanvas offcanvas-end"
        data-bs-scroll="true"
        tabIndex={-1}
        id="staticBackdrop"
      >
        <div className="offcanvas-header border-bottom h-70">
          <div className="">
            <h5 className="mb-0">Theme Customizer</h5>
            <p className="mb-0">Customize your theme</p>
          </div>
          <a
            href="#"
            className="primaery-menu-close"
            data-bs-dismiss="offcanvas"
          >
            <CloseOutlinedIcon />
          </a>
        </div>
        <div className="offcanvas-body">
          <div>
            <p>Theme variation</p>

            <div className="row g-3">
              <div className="col-12 col-xl-6">
                <input
                  type="radio"
                  value={"blue-theme"}
                  className="btn-check"
                  name="theme-options"
                  id="BlueTheme"
                  checked={themeMode === "blue-theme"}
                  onChange={(e) => onThemeChange(e)}
                />
                <label
                  className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                  htmlFor="BlueTheme"
                >
                  <span>
                    <ContactlessOutlinedIcon />
                  </span>
                  <span>Blue</span>
                </label>
              </div>
              <div className="col-12 col-xl-6">
                <input
                  type="radio"
                  value={"light"}
                  className="btn-check"
                  name="theme-options"
                  id="LightTheme"
                  checked={themeMode === "light"}
                  onChange={(e) => onThemeChange(e)}
                />
                <label
                  className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                  htmlFor="LightTheme"
                >
                  <span>
                    <LightModeOutlinedIcon />
                  </span>
                  <span>Light</span>
                </label>
              </div>
              <div className="col-12 col-xl-6">
                <input
                  type="radio"
                  value={"dark"}
                  className="btn-check"
                  name="theme-options"
                  id="DarkTheme"
                  checked={themeMode === "dark"}
                  onChange={(e) => onThemeChange(e)}
                />
                <label
                  className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                  htmlFor="DarkTheme"
                >
                  <span>
                    <DarkModeOutlinedIcon />
                  </span>
                  <span>Dark</span>
                </label>
              </div>
              <div className="col-12 col-xl-6">
                <input
                  type="radio"
                  value={"semi-dark"}
                  className="btn-check"
                  name="theme-options"
                  id="SemiDarkTheme"
                  checked={themeMode === "semi-dark"}
                  onChange={(e) => onThemeChange(e)}
                />
                <label
                  className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                  htmlFor="SemiDarkTheme"
                >
                  <span>
                    <ContrastOutlinedIcon />
                  </span>
                  <span>Semi Dark</span>
                </label>
              </div>
              <div className="col-12 col-xl-6">
                <input
                  type="radio"
                  value={"bordered-theme"}
                  className="btn-check"
                  name="theme-options"
                  id="BoderedTheme"
                  checked={themeMode === "bordered-theme"}
                  onChange={(e) => onThemeChange(e)}
                />
                <label
                  className="btn btn-outline-secondary d-flex flex-column gap-1 align-items-center justify-content-center p-4"
                  htmlFor="BoderedTheme"
                >
                  <span>
                    <BorderStyleOutlinedIcon />
                  </span>
                  <span>Bordered</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <ThemeSidebar themeMode={themeMode} setThemeMode={setThemeMode} />
    </>
  );
};

export default AddStudentFeedback;
