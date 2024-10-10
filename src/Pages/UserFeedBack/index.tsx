import { ChangeEvent, useEffect, useState } from "react";
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";

interface Question {
  id: string;
  question: string;
  options: string;
  answer?: string;
}

const Feedback = () => {
  let StudentId = localStorage.getItem("_id");
  const { getData, postData } = useApi();
  const [question, setQuestion] = useState<Question>({
    id: "",
    question: "",
    options: '',
  });
  const [options, setOptions] =useState<string[]>([''])
  const [questions, setQuestions] = useState<Question[]>([]);

  const [message, setMessage] = useState<string>("");
  const [answeredQuestions, setAnsweredQuestions] = useState<
    { question: string; answer: string }[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectAnswer, setSelectAnswer] = useState<string>("");

  const[editFlag, setEditFlag] = useState<boolean>(false);

  useEffect(() => {
 
      getData(`${'/feedback/'}`).then((data)=>{
        if(data.status===200){
            console.log(data.data);

          setQuestions(data.data);
          setQuestion(data.data[0]);
          setOptions(data.data[0].options.replace(/{|}/g, '').split(','));
          console.log();
        }
      })
  }, []);

  const handleSelectedOption = (value: string) => {
    setSelectAnswer(value);
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
        setOptions(questions[currentQuestionIndex + 1].options.replace(/{|}/g, '').split(','));
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
      setOptions(questions[currentQuestionIndex - 1].options.replace(/{|}/g, '').split(','));
      const previousAnswer =
        answeredQuestions[currentQuestionIndex - 1]?.answer || "";
      setSelectAnswer(previousAnswer);
    }
  };

  const handleSubmit = () => {
    const updatedAnswers = [
      ...answeredQuestions.slice(0, currentQuestionIndex),
      { question: "comment", answer: message },
      ...answeredQuestions.slice(currentQuestionIndex + 1),
    ];
    setAnsweredQuestions(updatedAnswers);

    console.log(answeredQuestions, message);
    alert("Form submitted successfully");
    // Handle submission logic here
    console.log(updatedAnswers);
    let payload = {
      student_id: StudentId,
      feedbacks: updatedAnswers,
    };
    console.log(payload);
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
      })
      .catch((error) => {
        console.error("Error while submitting feedback:", error);
        alert("Error while submitting feedback. Please try again later.");
      });
  };

  const handleWritenmessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };
  return (
    <>
      <h3 className="text-center m-3 fst-italic">Welcome to feedback</h3>
      {currentQuestionIndex < questions.length ? (
        <div>
          <div className="container" style={{ marginTop: "40px" }}>
            <div
              key={question.id}
              className="card"
              style={{ background: "#d3d3d3" }}
            >
              <div className="p-4">
                <h4 className="message-bubble fst-italic m-1">
                  Q. {question.question}
                </h4>
                <div className="row">
                  { questions.length > currentQuestionIndex &&
                  question.options.length > 0 ? (
                    options.map((option, index) => (
                      <div key={index} className="col-12 col-md-6 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="option"
                            id={`option-${index}`}
                            value={option}
                            checked={selectAnswer === option}
                            onChange={() => handleSelectedOption(option)}
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
                    <div>No options available</div>
                  )}
                </div>
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
      <h4 className="text-center m-2">
        {currentQuestionIndex + 1}/{questions.length + 1}
      </h4>

      <div className="col">
        <button
          className="btn btn-primary m-3"
          disabled={currentQuestionIndex === 0}
          onClick={handleBackQuestion}
          style={{ float: "left" }}
        >
          Back
        </button>
      </div>
      {currentQuestionIndex + 1 < questions.length + 1 ? (
        <div className="col">
          <button
            className="btn btn-primary m-3"
            onClick={handleNextQuestion}
            style={{ float: "right" }}
          >
            Next
          </button>
        </div>
      ) : (
        <button
          className="btn btn-primary m-3"
          onClick={handleSubmit}
          style={{ float: "right" }}
        >
          Submit
        </button>
      )}
    </>
  );
};

export default Feedback;
