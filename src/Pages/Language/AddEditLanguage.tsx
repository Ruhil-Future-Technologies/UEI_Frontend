/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from "react";
import "../Language/Language.scss";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "react-textarea-autosize";
import useApi from "../../hooks/useAPI";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { QUERY_KEYS_LANGUAGE } from "../../utils/const";
import { Grid, InputLabel, SelectChangeEvent, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { Field, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  LanguageRep0oDTO,
  MenuListinter,
} from "../../Components/Table/columns";
import { dataaccess, inputfield, inputfieldtext } from "../../utils/helpers";
import NameContext from "../Context/NameContext";
interface ILanguageForm {
  language_name: string;
  // description:string
}
const AddEditLanguage = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const LanguageAddURL = QUERY_KEYS_LANGUAGE.LANGUAGE_ADD;
  const LanguageEditURL = QUERY_KEYS_LANGUAGE.LANGUAGE_EDIT;
  const LanguageURL = QUERY_KEYS_LANGUAGE.GET_LANGUAGE;
  const { getData, postData, putData } = useApi();
  const navigate = useNavigate();
  const { id } = useParams();
  const formRef = useRef() as any;
  const LanguageNamePattern = /^[a-zA-Z\s]*$/;

  const location = useLocation();
  const Menulist: any = localStorage.getItem("menulist1");
  const pathSegments = location.pathname.split("/").filter(Boolean) || [];
  const lastSegment = id
    ? pathSegments[pathSegments.length - 3]?.toLowerCase() || ""
    : pathSegments[pathSegments.length - 2]?.toLowerCase() || "";
  const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);
  const initialState = {
    language_name: "",
  };
  const [language, setLanguage] = useState(initialState);
  const [dataLanguage, setDataLanguage] = useState<LanguageRep0oDTO[]>([]);

  useEffect(() => {
    setFilteredData(
      dataaccess(Menulist, lastSegment, { urlcheck: "" }, { datatest: "" })
    );
  }, [Menulist]);

  if (
    (id && !filteredData?.form_data?.is_update) ||
    (!id && !filteredData?.form_data?.is_save)
  ) {
    navigate("/main/Language");
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          // Make sure getData is a valid function returning a promise
          if (typeof getData === "function") {
            const data = await getData(`${LanguageEditURL}/${id}`);
            setLanguage(data?.data || initialState);
          } else {
            throw new Error("getData is not a function");
          }
        } catch (e: any) {
          toast.error(e?.message || "An error occurred while fetching data", {
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };

    fetchData();
  }, [id, LanguageEditURL, getData]);
  const callAPILanguage = async () => {
    getData(`${LanguageURL}`)
      .then((data: any) => {
        if (data?.data) {
          setDataLanguage(data?.data);
        }
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          // navigate("/")
        }
        // toast.error(e?.message, {
        //     hideProgressBar: true,
        //     theme: "colored",
        // });
      });
  };
  useEffect(() => {
    callAPILanguage();
  }, []);

  const handleChange = async (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
    fieldName: string
  ) => {
    setLanguage((prevMenu) => {
      return {
        ...prevMenu,
        [e.target.name]: e.target.value,
      };
    });

    formRef?.current?.setFieldValue(fieldName, e.target.value);
    if (
      formRef?.current?.errors?.[fieldName as keyof ILanguageForm] !== undefined
    ) {
      formRef?.current?.setFieldError(
        fieldName,
        formRef?.current?.errors?.[fieldName as keyof ILanguageForm]
      );
      formRef?.current?.setFieldTouched(fieldName, true);
    }
  };

  const handleSubmit = async (
    languageData: ILanguageForm,
    { resetForm }: FormikHelpers<ILanguageForm>
  ) => {
    // console.log("test submit", languageData)
    if (id) {
      putData(`${LanguageEditURL}/${id}`, languageData)
        .then((data) => {
          if (data.status === 200) {
            navigate("/main/Language");
            toast.success(data.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    } else {
      postData(LanguageAddURL, languageData)
        .then((data) => {
          if (data.status === 200) {
            // navigate('/main/Language');
            callAPILanguage();
            toast.success(data.message, {
              hideProgressBar: true,
              theme: "colored",
            });
            resetForm({ values: initialState });
            setLanguage(initialState);
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    }
  };
  let languageSchema;
  {
    if (id) {
      languageSchema = Yup.object().shape({
        language_name: Yup.string()
          .required("Please enter Language name")
          .test(
            "not-whitespace",
            "Please enter a valid Language name; whitespace is not allowed.",
            (value: any) => value && value?.trim().length > 0
          )
          .matches(
            LanguageNamePattern,
            "Please enter a valid Language name only characters allowed."
          )
          .test("unique", "Language name already exists", function (value) {
            if (!value) return true;

            // Check if the value matches the current institute name
            if (value.toLowerCase() === language?.language_name.toLowerCase()) {
              return true;
            }

            // Check for uniqueness against dataInstitute
            const exists = dataLanguage?.some(
              (inst) =>
                inst?.language_name &&
                inst?.language_name.toLowerCase() === value?.toLowerCase()
            );

            return !exists;
          }),
        // description: Yup.string()
        // .required("Please enter description ")
      });
    } else {
      languageSchema = Yup.object().shape({
        language_name: Yup.string()
          .required("Please enter Language name")
          .test(
            "not-whitespace",
            "Please enter a valid Language name; whitespace is not allowed.",
            (value: any) => value && value?.trim().length > 0
          )
          .matches(
            LanguageNamePattern,
            "Please enter a valid Language name only characters allowed."
          )
          .test("unique", "Language name already exists", (value) => {
            if (!value) return true;
            const exists = dataLanguage?.some(
              (inst) =>
                inst?.language_name &&
                inst?.language_name?.toLowerCase() === value?.toLowerCase()
            );
            return !exists;
          }),
        // description: Yup.string()
        // .required("Please enter description ")
      });
    }
  }

  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="card p-lg-3">
          <div className="card-body">
            <Typography variant="h6" className="mb-3">
              {id ? (
                <div className="main_title">Edit Language</div>
              ) : (
                <div className="main_title">Add Language</div>
              )}
            </Typography>
            <Formik
              onSubmit={(formData, formikHelpers) =>
                handleSubmit(formData, formikHelpers)
              }
              initialValues={{
                language_name: language?.language_name,
              }}
              enableReinitialize
              validationSchema={languageSchema}
              innerRef={formRef}
            >
              {({ errors, values, touched }: any) => (
                <Form>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form_field_wrapper">
                        <Field
                          inputProps={{ "data-testid": "language_name" }}
                          component={TextField}
                          type="text"
                          label="Language Name *"
                          name="language_name"
                          value={values.language_name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, "language_name")
                          }
                        />
                        {errors.language_name && touched.language_name ? (
                          <p style={{ color: "red" }} color="error">
                            {errors.language_name}
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4 mt-2">
                      <div className="col">
                        <Grid item xs={12}>
                          <Typography
                            variant="h6"
                            sx={{ color: inputfieldtext(namecolor) }}
                          >
                            Upload a Photo
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <input
                            data-testid="language_file"
                            type="file"
                            accept="image/*"
                            id="file-upload"
                            style={{ color: inputfieldtext(namecolor) }}
                          />
                        </Grid>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-md-4">
                      <InputLabel
                        className="text-secondary"
                        sx={{ color: inputfieldtext(namecolor) }}
                      >
                        Description
                      </InputLabel>
                      <TextareaAutosize
                        data-testid="language_description"
                        aria-label="empty textarea"
                        minRows={5}
                        style={{
                          width: "100%",
                          fontSize: "1rem",
                          backgroundColor: inputfield(namecolor),
                          color: inputfieldtext(namecolor),
                        }}
                        placeholder="Enter your text here..."
                        name="description"
                        value={values.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          handleChange(e, "description")
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <button
                      data-testid="submitBtn"
                      type="submit"
                      className="btn btn-primary mainbutton"
                    >
                      {id ? "Update" : "Save"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditLanguage;
