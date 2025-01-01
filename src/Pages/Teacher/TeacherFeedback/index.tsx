import React from 'react';

const TeacherFeedback = () => {
  const Questions = [
    {
      id: 1,
      question: "How would you rate the teacher's knowledge of the subject?",
      options: {
        1: 'Excellent',
        2: 'Good',
        3: 'Average',
        4: 'Poor',
      },
    },
    {
      id: 2,
      question: 'How effectively does the teacher explain concepts?',
      options: {
        1: 'Very effectively',
        2: 'Effectively',
        3: 'Neutral',
        4: 'Not effectively',
      },
    },
    {
      id: 3,
      question:
        'Does the teacher encourage questions and discussions in class?',
      options: {
        1: 'Yes, always',
        2: 'Sometimes',
        3: 'Rarely',
        4: 'Not at all',
      },
    },
    {
      id: 4,
      question: "How would you rate the teacher's ability to manage the class?",
      options: {
        1: 'Excellent',
        2: 'Good',
        3: 'Average',
        4: 'Poor',
      },
    },
    {
      id: 5,
      question: 'Does the teacher provide constructive feedback on your work?',
      options: {
        1: 'Yes, always',
        2: 'Sometimes',
        3: 'Rarely',
        4: 'Not at all',
      },
    },
    {
      id: 6,
      question: "How would you rate the teacher's communication skills?",
      options: {
        1: 'Excellent',
        2: 'Good',
        3: 'Average',
        4: 'Poor',
      },
    },
    {
      id: 7,
      question:
        'Does the teacher use diverse methods to explain topics (e.g., examples, visuals, etc.)?',
      options: {
        1: 'Yes, very often',
        2: 'Sometimes',
        3: 'Rarely',
        4: 'Not at all',
      },
    },
    {
      id: 8,
      question:
        'How approachable is the teacher for doubts and clarifications?',
      options: {
        1: 'Very approachable',
        2: 'Approachable',
        3: 'Somewhat approachable',
        4: 'Not approachable',
      },
    },
  ];

  const handelAnswer = () => {};
  return (
    <>
      <div className="main-wrapper">
        <div className="main-content">
          <div className="feedback">
            <h1>Give Your Valuable Feedback</h1>

            <div className="feedback-questions">
              {Questions.map((data) => (
                <div className="question" key={data.id}>
                  <label htmlFor="" className="top-label">
                    {data.question}
                  </label>

                  <div className="row g-2">
                    {Object.entries(data.options).map(([key, val]) => (
                      <div className="col-lg-6" key={key}>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`flexRadioDefault-${data.id}`}
                            id={`flexRadioDefault1-${data.id}-${key}`}
                            value={key}
                            onChange={handelAnswer}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`flexRadioDefault1-${data.id}-${key}`}
                          >
                            {val}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-primary mt-4 mx-auto d-block rounded-pill px-4">
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default TeacherFeedback;
