import React from "react";
const InstitutionFeedback = () => {
    const Questions = [
        {
            id: 1,
            question: "How would you rate the quality of teaching?",
            options: {
                1: "Excellent",
                2: "Good",
                3: "Average",
                4: "Poor"
            }
        },
        {
            id: 2,
            question: "How satisfied are you with the course content?",
            options: {
                1: "Very Satisfied",
                2: "Satisfied",
                3: "Neutral",
                4: "Dissatisfied"
            }
        },
        {
            id: 3,
            question: "Was the course material helpful in understanding the subject?",
            options: {
                1: "Yes, very helpful",
                2: "Somewhat helpful",
                3: "Neutral",
                4: "Not helpful"
            }
        },
        {
            id: 4,
            question: "How would you rate the facilities provided by the institute?",
            options: {
                1: "Excellent",
                2: "Good",
                3: "Average",
                4: "Poor"
            }
        },
        {
            id: 5,
            question: "Would you recommend this institute to others?",
            options: {
                1: "Yes, definitely",
                2: "Maybe",
                3: "Not sure",
                4: "No"
            }
        },
        {
            id: 6,
            question: "How would you rate the communication skills of the instructor?",
            options: {
                1: "Excellent",
                2: "Good",
                3: "Average",
                4: "Poor"
            }
        },
        {
            id: 7,
            question: "Was the duration of the course sufficient to cover all topics?",
            options: {
                1: "Yes, perfectly",
                2: "Somewhat sufficient",
                3: "Too short",
                4: "Too long"
            }
        },
        {
            id: 8,
            question: "How satisfied are you with the support provided by the institute staff?",
            options: {
                1: "Very Satisfied",
                2: "Satisfied",
                3: "Neutral",
                4: "Dissatisfied"
            }
        }
    ];
 const handelAnswer=()=>{
    
 }
    return (
        <>
            <div className="feedback">
                <h1>Give Your Valuable Feedback</h1>

                <div className="feedback-questions">
                    {Questions.map(data =>
                        <div className="question" key={data.id}>
                            <label htmlFor="" className="top-label">{data.question}</label>

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
                                            <label className="form-check-label" htmlFor={`flexRadioDefault1-${data.id}-${key}`}>
                                               {val}
                                            </label>
                                        </div>
                                    </div>

                                ))}


                            </div>
                        </div>
                    )}
                </div>

                <button className="btn btn-primary mt-4 mx-auto d-block rounded-pill px-4">Submit</button>
            </div>
        </>
    );

}
export default InstitutionFeedback;