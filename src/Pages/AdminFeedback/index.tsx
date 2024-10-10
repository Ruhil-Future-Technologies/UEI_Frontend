import React, { useState, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import useApi from "../../hooks/useAPI";

import { toast } from "react-toastify";
const AdminFeedback: React.FC = () => {

    let StudentId = localStorage.getItem("_id");
    const {getData,postData}=useApi();
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([""]);

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleOptionChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleDeleteOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSave = () => {
    // Save question and options to your database or API here
    let payload = {
      question: question,
      options: options,
    };

    postData("/feedback/add",payload).then((response) => {
        console.log(response);
       if( response.status===200){
     toast.success("question added successfully",{
         hideProgressBar:true,
         theme:"colored"
       });
       setOptions([""]);
       setQuestion("");
       }
        
  });
}
  return (
    <div className="container mt-4">
      <h1>Add Feedback Questions</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control col-6"
          placeholder="Add your question"
          value={question}
          onChange={handleQuestionChange}
        />
      </div>
      <div>
        {options.map((option, index) => (
          <div className="row">
            <div key={index} className="mb-3 col-6">
              <input
                type="text"
                className="form-control"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e)}
              />
            </div>
            <div className="col">
              <AddIcon className="m-2" onClick={handleAddOption} />
              {index > 0 && (
                <DeleteIcon
                  className="m-2"
                  onClick={() => handleDeleteOption(index)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={handleSave}>
        save
      </button>
    </div>
  );
};

export default AdminFeedback;
