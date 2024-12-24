/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { SelectChangeEvent, TextField } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Field, Form, Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { deepEqual, inputfieldtext } from "../../utils/helpers";
import NameContext from "../Context/NameContext";
import { ChildComponentProps } from "../StudentProfile";
interface IAdminDescription {
  description: string;
}

const AdminDescription: React.FC<ChildComponentProps> = () => {
  const initialState = {
    description: "",
  };
  const context = React.useContext(NameContext);
  const { namecolor,activeForm, setActiveForm }: any = context;
  const adminId = localStorage.getItem("_id");
  const { getData, postData, putData } = useApi();
  const [description, setDesctiption] = useState(initialState);
  const [editFalg, setEditFlag] = useState<boolean>(false);
  const[editable,setEditable]=useState(true);
  const[chaged,setChaged] = useState(false);
  const navigator = useNavigate();
  // const formRef = useRef() as any
  const formRef = useRef<FormikProps<IAdminDescription>>(null);

  const getDescription = async () => {
    try {
      const response = await getData(
        "admin_profile_description/edit/" + adminId
      );

      if (response && response?.status === 200) {
        setDesctiption(response?.data);
      } else if (response && response?.status === 404) {
        setEditFlag(true);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error: any) {
      if (error?.response && error?.response?.status === 401) {
        navigator("/");
        toast.warning("Please login again", {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center",
        });
      } else {
        toast.error("Request failed", {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center",
        });
      }
    }
  };
  useEffect(() => {
    getDescription();
  }, [adminId]);

useEffect(()=>{
  getData(
    "admin_profile_description/edit/" + adminId
  ).then((response)=>{
  if (response && response?.status === 200) {
    setEditable(false);
    console.log(editable);
  } else if (response && response?.status === 404) {
    setEditable(true);
  }
})
},[activeForm])


  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>,
    fieldName: string
  ) => {
    setChaged(true);
    setDesctiption((prevMenu) => {
      return {
        ...prevMenu,
        [e.target.name]: e.target.value,
      };
    });
    formRef?.current?.setFieldValue(fieldName, e.target.value);
    await formRef?.current?.validateField(fieldName);
    if (
      formRef?.current?.errors?.[fieldName as keyof IAdminDescription] !==
      undefined
    ) {
      formRef?.current?.setFieldError(
        fieldName,
        formRef?.current?.errors?.[fieldName as keyof IAdminDescription]
      );
      formRef?.current?.setFieldTouched(fieldName, true);
    }
  };
  // const submitHandle = (event: any,descriptionData:{description:string}) => {
  const submitHandle = async (description1: IAdminDescription) => {
    const eq = deepEqual(description1, formRef?.current?.initialValues);
    // event.preventDefault();
    const paylod = {
      admin_id: adminId,
      description: description1?.description,
    };
    console.log("aschgsdcchjgjfa fegeg erg rtg ");
    console.log(editable,editFalg);
    if (editFalg && editable) {
      console.log(editable);
      const saveData = async () => {
        try {
          const response = await postData(
            "admin_profile_description/add",
            paylod
          );

          if (response?.status === 200) {
            toast.success("Admin description saved successfully", {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center",
            });
            setChaged(false);
            setActiveForm((prev: number) => prev + 1);
          }
        } catch (error: any) {
          if (error?.response?.status === 401) {
            toast.warning("Please login again", {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center",
            });
          } else {
            toast.error("Request failed", {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center",
            });
          }
        }
      };
      if(chaged){
        saveData();
      }else{
 //code not here
      }
     
    } else if (!editable ) {
      console.log(editable);
      const editData = async () => {
        try {
          const response = await putData(
            "admin_profile_description/edit/" + adminId,
            paylod
          );

          if (response?.status === 200) {
            toast.success("Admin description updated successfully", {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center",
            });
            setActiveForm((prev: number) => prev + 1);
            getDescription();
          } else {
            toast.error("something want wrong ", {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center",
            });
          }
        } catch (error: any) {
          if (error?.response?.status === 401) {
            navigator("/");
            toast.warning("Please login again", {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center",
            });
          } else {
            toast.error("Request failed", {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center",
            });
          }
        }
      };

      // eslint-disable-next-line no-lone-blocks
      console.log(!eq)
      if (!eq && chaged) editData();
      else setActiveForm((prev: number) => prev + 1);
    }
  };
  const descriptionSchema = Yup.object().shape({
    description: Yup.string().required("Please enter Description"),
  });
  return (
    <Formik
      onSubmit={(formData) => submitHandle(formData)}
      initialValues={{
        description: description?.description,
      }}
      enableReinitialize
      validationSchema={descriptionSchema}
      innerRef={formRef}
    >
      {({ errors, values, touched, handleSubmit }: any) => (
        <Form>

          <Field
            id="description"
            label="Description *"
            component={TextField}
            type="text"
            name="description"
            fullWidth
            rows={9}
            multiline
            margin="normal"
            value={values?.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e, "description")
            }
            InputProps={{
              style: {
                color: inputfieldtext(namecolor), // Change this to your desired text color
              },
            }}
            InputLabelProps={{
              style: {
                color: inputfieldtext(namecolor), // Change this to your desired label color
              },
            }}
          />
          {touched?.description && errors?.description ? (
            <p style={{ color: "red" }}>{errors?.description}</p>
          ) : (
            <></>
          )}
          {/* </CardContent>
          </Card> */}
          <div
            className="row justify-content-center"
            style={{ margin: "10px" }}
          >
            <div className="col-lg-12">
              <div className="mt-3 d-flex align-items-center justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-dark prev-btn px-lg-4  rounded-pill"
                  onClick={() => {
                    setActiveForm((prev: number) => prev - 1);
                  }}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-dark px-lg-5 px-4  ms-auto d-block rounded-pill next-btn"
                  onClick={handleSubmit}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AdminDescription;
