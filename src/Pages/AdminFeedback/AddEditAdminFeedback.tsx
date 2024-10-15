import { useNavigate, useParams } from "react-router-dom";
import { QUERY_KEYS_FEEDBACK } from "../../utils/const";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import { inputfield, inputfieldtext } from "../../utils/helpers";
import * as Yup from "yup";
import NameContext from "../Context/NameContext";
import {
  ErrorMessage,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
  setNestedObjectValues,
} from "formik";
import TextField from "@mui/material/TextField";
interface IFeedbackForm {
  question: string | null;
  options: any[];
}
const AddEditAdminFeedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useContext(NameContext);
  const formRef = useRef() as any;
  const [question, setQuestion] = useState("");
  const { namecolor }: any = context;
  const { getData, postData, putData } = useApi();
  const FeedbackAddURL = QUERY_KEYS_FEEDBACK.FEEDBACK_ADD;
  const GetFeedbackURL = QUERY_KEYS_FEEDBACK.GET_FEEDBACK;
  const FeedbackEditURL = QUERY_KEYS_FEEDBACK.FEEDBACK_EDIT;

  const [initialValues, setInitialValues] = useState<any>({
    question: "",
    options: [{ option: "" }],
  });

  useEffect(() => {
    if (id) {
      getData(`${GetFeedbackURL}`).then((data: any) => {
        const datavalue = data?.data;

        let getByIdFeedbackData = datavalue.filter(
          (data: any) => data.id == id
        );
        let optionStringify = getByIdFeedbackData[0].options;
        let optionData = optionStringify.map((str: any) => {
          return { option: str };
        });

        let newObject = {
          question: getByIdFeedbackData[0].question,
          options: optionData,
        };

        setInitialValues(JSON.parse(JSON.stringify(newObject)));
      });
    }
  }, [id]);

  const handleSubmit = (formData: any, { resetForm }: FormikHelpers<any>) => {
    let optionsString: any = [];
    formData.options.map((item: any) => {
      optionsString.push(item.option);
    });
    let stringifyOptions: any = JSON.stringify(optionsString);

    // Save question and options to your database or API here
    let payload = {
      question: formData.question,
      options: stringifyOptions,
    };

    if (id) {
      putData(`${FeedbackEditURL}/${id}`, payload).then((response) => {
        if (response.status === 200) {
          toast.success("question added successfully", {
            hideProgressBar: true,
            theme: "colored",
          });
          resetForm();
          navigate("/main/feedback");
          // setOptions([""]);
          // setQuestion("");
        }
      });
    } else {
      postData(`${FeedbackAddURL}`, payload).then((response) => {
        if (response.status === 200) {
          toast.success("question added successfully", {
            hideProgressBar: true,
            theme: "colored",
          });
          resetForm();
          navigate("/main/feedback");
          // setOptions([""]);
          // setQuestion("");
        }
      });
    }
  };

  const handleQuestionChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // throw new Error("Function not implemented.");
    setQuestion(e.target.value);
    formRef?.current?.setFieldValue(e.target.name, e.target.value);
    const err = await formRef?.current?.validateForm();
    if (err && Object.keys(err).length > 0) {
      formRef?.current?.setErrors(err);
      formRef?.current?.setTouched(setNestedObjectValues(err, true));
      formRef?.current?.setFieldError(
        e.target.name,
        formRef?.current?.errors?.[e.target.name as keyof IFeedbackForm]
      );
      formRef?.current?.setFieldTouched(e.target.name, true);
    }
  };

  const validationSchema = Yup.object({
    question: Yup.string().required("This field is required"),
    options: Yup.array().of(
      Yup.object({
        option: Yup.string().required("This field is required"),
      })
    ),
  });

  return (
    <div className="main-wrapper">
      <div className="main-content">
      <div className="card p-lg-3">
        <div className="card-body">
          {/* <Typography variant="h6"> */}
          <div className="card-title">
            {id ? "Edit" : "Add"} Feedback Questions
          </div>
          <Formik
            onSubmit={(values, formikHelpers) =>
              handleSubmit(values, formikHelpers)
            }
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            innerRef={formRef}
          >
            {({ errors, values, touched, isValid, dirty }) => (
              <Form>
                <div className="row gy-4">
                  <div className="col-md-4">
                    <div className="form_field_wrapper">
                      <TextField
                        label="Question *"
                        name="question"
                        value={values.question}
                        variant="outlined"
                        onChange={handleQuestionChange}
                      />
                      <ErrorMessage
                        name="question"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div>
                      <FieldArray name="options">
                        {({ push, remove }) => (
                          <div>
                            {values.options.length > 0 &&
                              values.options.map(
                                (option: any, index: number) => (
                                  <div key={index} className="d-flex">
                                    <div className="mb-3  pb-2">
                                      <TextField
                                        label="Option *"
                                        name={`options[${index}].option`}
                                        value={option.option}
                                        placeholder={`Enter Option ${
                                          index + 1
                                        }`}
                                        variant="outlined"
                                        onChange={handleQuestionChange}
                                      />
                                      <ErrorMessage
                                        name={`options.${index}.option`}
                                        component="div"
                                        className="text-danger"
                                      />
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center ">
                                      {values.options.length > 1 && (
                                        <DeleteIcon
                                          type="button"
                                          onClick={() => remove(index)}
                                          style={{
                                            backgroundColor:
                                              inputfield(namecolor),
                                            color: inputfieldtext(namecolor),
                                          }}
                                        />
                                      )}
                                      <AddIcon
                                        className="m-2"
                                        onClick={() => push({ option: "" })}
                                      />
                                    </div>
                                  </div>
                                )
                              )}
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                </div>
                <button className="btn btn-primary mainbutton" type="submit">
                  {id ? "Update" : "Save"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      </div>
     
    </div>
  );
};

export default AddEditAdminFeedback;
