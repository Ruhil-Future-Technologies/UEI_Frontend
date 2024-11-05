import React, { useEffect, useRef, useState } from "react";
import "../Entity/Entity.scss";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import useApi from "../../hooks/useAPI";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { QUERY_KEYS_ENTITY } from "../../utils/const";
import { toast } from "react-toastify";
import {
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
  setNestedObjectValues,
} from "formik";
import * as Yup from "yup";
import { MenuListinter } from "../../Components/Table/columns";
import { dataaccess } from "../../utils/helpers";

const AddEditEntity = () => {
  const EntityAddURL = QUERY_KEYS_ENTITY.ENTITY_ADD;
  const EntityEditURL = QUERY_KEYS_ENTITY.ENTITY_EDIT;
  const EntityNamePattern = /^[a-zA-Z\s]*$/;
  const { getData, postData, putData } = useApi();
  const navigator = useNavigate();
  const { id } = useParams();
  const [entity, setEntity] = useState("");
  const formRef = useRef<FormikProps<{ entity_type: string }>>(null);
  const location = useLocation();
  const Menulist: any = localStorage.getItem("menulist1");
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = id
    ? pathSegments[pathSegments.length - 3].toLowerCase()
    : pathSegments[pathSegments.length - 2].toLowerCase();
  const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);

  // const GetDataList = () => {
  //     JSON.parse(Menulist)?.map((data: any) => {
  //         const fistMach = data?.menu_name.toLowerCase() === lastSegment && data;
  //         if (fistMach.length > 0) {
  //             setFilteredData(fistMach)
  //         }
  //         const result = data?.submenus?.filter((menu: any) => menu.menu_name.toLowerCase() === lastSegment)
  //         if (result.length > 0) {
  //             setFilteredData(result)
  //         }
  //     })
  // }

  useEffect(() => {
    // GetDataList()
    setFilteredData(
      dataaccess(Menulist, lastSegment, { urlcheck: "" }, { datatest: "" })
    );
  }, [Menulist]);

  if (
    (id && !filteredData?.form_data?.is_update) ||
    (!id && !filteredData?.form_data?.is_save)
  ) {
    navigator("/main/entity");
  }

  const callAPI = async () => {
    if (id) {
      getData(`${EntityEditURL}${id ? `/${id}` : ""}`)
        .then((data: { data: { entity_type: string } }) => {
          setEntity(data?.data?.entity_type);
        })
        .catch((e) => {
          if (e?.response?.status === 401) {
            navigator("/");
          }
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntity(e.target.value);
    formRef?.current?.setFieldValue("entity_type", e.target.value);
    const err = await formRef?.current?.validateForm();
    if (err && Object.keys(err).length > 0) {
      formRef?.current?.setErrors(err);
      formRef?.current?.setTouched(setNestedObjectValues(err, true));
    }
  };

  // const handleSubmit = async (formData: { entity_type: string; }) => {
  const handleSubmit = async (
    formData: { entity_type: string },
    { resetForm }: FormikHelpers<{ entity_type: string }>
  ) => {
    if (id) {
      putData(`${EntityEditURL}/${id}`, formData)
        .then((data: { status: number; message: string }) => {
          if (data.status === 200) {
            navigator("/main/Entity");
            toast.success(data.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          } else {
            toast.error(data.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          }
        })
        .catch((e) => {
          if (e?.response?.status === 401) {
            navigator("/");
          }
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    } else {
      postData(`${EntityAddURL}`, formData)
        .then((data: { status: number; message: string }) => {
          if (data.status === 200) {
            // navigator('/main/Entity')
            toast.success(data.message, {
              hideProgressBar: true,
              theme: "colored",
            });

            // resetForm({ values:{ entity_type:""} });
            setEntity("");
          } else {
            toast.error(data.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          }
        })
        .catch((e) => {
          if (e?.response?.status === 401) {
            navigator("/");
          }
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    }
  };

  const entitySchema = Yup.object().shape({
    entity_type: Yup.string()
      .required("Please enter Entity type")
      .test(
        "not-whitespace",
        "Please enter a valid Entity type; whitespace is not allowed.",
        (value:any) => value && value?.trim().length > 0 
      )
      .matches(
        EntityNamePattern,
        "Please enter a valid Entity Type only characters allowed."
      ),
  });

  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="card p-lg-2">
          <div className="card-body">
            <Formik
              // onSubmit={(formData) => handleSubmit(formData)}
              onSubmit={(formData, formikHelpers) =>
                handleSubmit(formData, formikHelpers)
              }
              initialValues={{
                entity_type: entity,
              }}
              enableReinitialize
              validationSchema={entitySchema}
              innerRef={formRef}
            >
              {({ errors, values, touched, isValid, dirty }) => (
                <Form>
                  <div className="row gy-4 flex-column ">
                    <div className="col-lg-3">
                      <Typography variant="h6">
                        <div className="main_title">
                          {id ? "Edit" : "Add"} Entity
                        </div>
                      </Typography>
                    </div>
                    <div className="col-md-3">
                      <div className="form_field_wrapper">
                        <Field
                          className="w-100"
                          component={TextField}
                          type="text"
                          name="entity_type"
                          placeholder="Entity Type"
                          label="Entity Type *"
                          value={values?.entity_type}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e)
                          }
                          // onChange={handleChange}
                          //   error={touched.entity_type && !!errors.entity_type}
                          //   helperText={touched.entity_type && errors.entity_type}
                        />
                        {touched?.entity_type && errors?.entity_type ? (
                          <p style={{ color: "red" }}>{errors?.entity_type}</p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <button className="btn btn-primary w-100 mh-56 mainbutton">
                        {id ? "Update" : "Save"}
                      </button>
                    </div>
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

export default AddEditEntity;
