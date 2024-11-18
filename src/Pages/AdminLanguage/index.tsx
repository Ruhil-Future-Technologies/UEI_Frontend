import React, { useContext, useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useAPI";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  inputfield,
  inputfieldhover,
  inputfieldtext,
  tabletools,
} from "../../utils/helpers";
import NameContext from "../Context/NameContext";
import { ChildComponentProps } from "../StudentProfile";

interface Language {
  id: string;
  is_active?: number;
  language_name: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(
  languageName: string,
  selectedLanguages: readonly Language[],
  theme: Theme
) {
  return {
    fontWeight:
      selectedLanguages
        .map((lang) => lang.language_name)
        .indexOf(languageName) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const AdminLanguage: React.FC<ChildComponentProps> = ({ setActiveForm }) => {
  let AdminId = localStorage.getItem("_id");
  // console.log(AdminId);
  // const storeLanguage: Language[] = [];
  interface Box {
    id: number;
    language_id: any;
    proficiency: any;
  }
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const { getData, postData, putData, deleteData } = useApi();

  const theme = useTheme();
  const [alllanguage, setAllLanguage] = React.useState<Language[]>([]);
  const [selectedLeng, setSelectedLeng] = useState<any>();
  const [editFalg, setEditFlag] = useState<boolean>(false);
  //const [selectedLeng,setSelectedLeng]=useState();
  // const [id, setId] = useState([]);

  // const handleIdChange = () => {
  //   setId();

  // };

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [proficiency, setProficiency] = useState<any>("read");

  const addRow = () => {
    setBoxes((prevBoxes) => [
      ...prevBoxes,
      { id: 0, language_id: "", proficiency: "" },
    ]);
  };

  const deleterow = (id: any, indx: number) => {
    if (id !== 0) {
      deleteData(`/admin_language_known/delete/${id}`)
        .then((data: any) => {
          if (data.status === 200) {
            toast.success("Language deleted successfully", {
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
    }
    // setBoxes(boxes.filter((box) => box.id !== id));
    setBoxes(boxes.filter((box, index) => index !== indx));
    //   toast.success("Admin Language known Deleted Successfully", {
    //     hideProgressBar: true,
    //     theme: "colored",
    // });
  };

  useEffect(() => {
    getData(`${"language/list"}`)
      .then((data: any) => {
        if (data?.status === 200) {
          const filteredData = data?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setAllLanguage(filteredData || []);
          // setAllLanguage(data?.data);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
    getData(`${"admin_language_known/edit/" + AdminId}`)
      .then((data: any) => {
        if (data?.status === 200) {
          //    setAllLanguage(data?.data);
          const lenduageIds = data.data.language_id;
          setSelectedLeng(lenduageIds);
          data.data.map((item: any, index: number) => {
            const newBox: Box = {
              id: item.id,
              language_id: item.language_id,
              proficiency: item.proficiency,
            };
            if (!boxes.some((box) => box.id === newBox.id)) {
              // setBoxes([...boxes, newBox]);
              setBoxes((prevBoxes) => [...prevBoxes, newBox]);
            }
          });
        } else if (data?.status === 404) {
          setBoxes([{ id: 1, language_id: "", proficiency: "" }]);
          setEditFlag(true);
        } else {
          toast.error(data?.message, {
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
  }, []);

  const saveLanguage = (
    event: React.FormEvent<HTMLFormElement | typeof setSelectedLeng>
  ) => {
    event.preventDefault();
    
    let valid = true;
    boxes.forEach((box, index) => {
      if (!box.language_id || !box.proficiency) {
        valid = false;
        setError((prevError) => ({
          ...prevError,
          [index]: {
            language_error: !box.language_id,
            proficiency_error: !box.proficiency,
          },
        }));
      }
    });

    if (!valid) return; // Don't proceed if validation fails
      setActiveForm((prev) => prev + 1);
    boxes.forEach((box) => {
      const payload = {
        admin_id: AdminId,
        language_id: box.language_id,
        proficiency: box.proficiency,
      };
      if (editFalg) {
        postData("admin_language_known/add", payload)
          .then((data: any) => {
            if (data.status === 200) {
              toast.success("Language saved successfully", {
                hideProgressBar: true,
                theme: "colored",
              });
            } else {
              toast.error(data?.message, {
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
        if (box.id === 0) {
          postData("admin_language_known/add", payload)
            .then((data: any) => {
              if (data.status === 200) {
                toast.success("Language saved successfully", {
                  hideProgressBar: true,
                  theme: "colored",
                });
              } else {
                toast.error(data?.message, {
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
          // console.log("this is kjnfdfsj",payload)
          putData("admin_language_known/edit/" + AdminId, payload)
            .then((data: any) => {
              if (data.status === 200) {
                toast.success("Language updated successfully", {
                  hideProgressBar: true,
                  theme: "colored",
                });
              } else {
                toast.error(data?.message, {
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
        }
      }
    });

    // payloads.forEach(payload => {

    // });
  };

  //
  const handleChange = (event: SelectChangeEvent<string>, index: number) => {
    const { name, value } = event.target;
    setBoxes((prevBoxes) =>
      prevBoxes.map((box, i) =>
        i === index ? { ...box, language_id: value } : box
      )
    );
    // setFormData({
    //     ...formData, [name]: value
    // })
    // validateSelection(value, index);
    validateFields(index, "language");
  };

  const handleChange1 = (event: SelectChangeEvent<string>, index: number) => {
    const { value } = event.target;
    setBoxes((prevBoxes) =>
      prevBoxes.map((box, i) =>
        i === index ? { ...box, proficiency: value } : box
      )
    );
    validateFields(index, "proficiency");
  };

  // console.log("boxes sasa", boxes);
  const [error, setError] = useState<{ [key: number]: { language_error: boolean; proficiency_error: boolean } }>({});
  const validateFields = (index: number, field: string) => {
    setError((prevError) => ({
      ...prevError,
      [index]: {
        ...prevError[index],
        ...(field === "language" && { language_error: !boxes[index].language_id }),
        ...(field === "proficiency" && { proficiency_error: !boxes[index].proficiency }),
      },
    }));
  };
  return (
    <form>
      <p className="font-weight-bold profiletext mt-4">
        <b> Language Known</b>
      </p>
      {boxes.map((box, index) => (
        <div
          className="row d-flex justify-content-start align-items-center mt-4"
          key={index}
        >
          <div className="col form_field_wrapper ">
            <FormControl required sx={{ m: 1 , mt:  error[index]?.language_error && box.language_id == "" ? 4 :1 }} fullWidth>
              <InputLabel id={`language-label-${box.id}`}>Language</InputLabel>
              <Select
                labelId={`language-label-${box.id}`}
                id={`language-select-${box.id}`}
                name={`language_${box.id}`}
                value={box.language_id}
                label="Language *"
                sx={{
                  backgroundColor: "#f5f5f5",
                }}
                onChange={(e) => {
                  handleChange(e, index);
                }}
                onBlur={() => validateFields(index, "language")}
              >
                {alllanguage
                 .filter((lang) => lang.id === box.language_id)
                .map((lang) => (
                  <MenuItem
                    key={lang.id}
                    value={lang.id}
                    disabled
                    sx={{
                      backgroundColor: inputfield(namecolor),
                      color: inputfieldtext(namecolor),
                      "&:hover": {
                        backgroundColor: inputfieldhover(namecolor),
                      },
                    }}
                  >
                    {lang.language_name}
                  </MenuItem>
                ))}
                  {/* Render the rest of the languages except the ones already selected in other boxes */}
                {alllanguage
            .filter(
              (lang) =>
                lang.id !== box.language_id &&
                !boxes.some((b) => b.language_id === lang.id)
            )
            .map((lang) => (
              <MenuItem
                key={lang.id}
                value={lang.id}
                sx={{
                  backgroundColor: inputfield(namecolor),
                  color: inputfieldtext(namecolor),
                  "&:hover": {
                    backgroundColor: inputfieldhover(namecolor),
                  },
                }}
              >
                {lang.language_name}
              </MenuItem>
            ))}
              </Select>
              {error[index]?.language_error && box.language_id == "" && <FormHelperText style={{color: "red"}}>Language is required</FormHelperText>}
            </FormControl>
          </div>
          <div className="col form_field_wrapper">
            <FormControl required sx={{ m: 1 , mt:  error[index]?.proficiency_error &&  box.proficiency == "" ? 4 :1 }} fullWidth>
              <InputLabel id={`proficiency-label-${box.id}`}>
                Proficiency
              </InputLabel>
              <Select
                labelId={`proficiency-label-${box.id}`}
                id={`proficiency-select-${box.id}`}
                name={`proficiency_${box.id}`}
                value={box.proficiency}
                label="Proficiency *"
                sx={{
                  backgroundColor: "#f5f5f5",
                }}
                onChange={(e) => {
                  handleChange1(e, index);
                }}
                onBlur={() => validateFields(index, "proficiency")}
              >
                <MenuItem
                  value={"read"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  Read
                </MenuItem>
                <MenuItem
                  value={"write"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  Write
                </MenuItem>
                <MenuItem
                  value={"both"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  Both
                </MenuItem>
              </Select>
              {error[index]?.proficiency_error &&  box.proficiency == "" && <FormHelperText style={{color: "red"}}>Proficiency is required</FormHelperText>}
            </FormControl>
          </div>
          <div className="col form_field_wrapper d-flex">
            <IconButton
              onClick={addRow}
              sx={{
                width: "35px",
                height: "35px",
                color: tabletools(namecolor),
              }}
            >
              <AddCircleOutlinedIcon />
            </IconButton>
            {boxes.length !== 1 && (
              <IconButton
                onClick={() => deleterow(box.id, index)}
                sx={{
                  width: "35px",
                  height: "35px",
                  color: tabletools(namecolor),
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            )}
          </div>
        </div>
      ))}
      <div className="row justify-content-center">
        {/* <div className="col-md-12">
          <button
            className="btn btn-primary mainbutton"
            style={{ marginTop: "25px" }}
          >
            Save your language
          </button>
        </div> */}
        <div className="col-lg-12">
          <div className="mt-3 d-flex align-items-center justify-content-between">
            <button
              type="button"
              className="btn btn-outline-dark prev-btn px-lg-4  rounded-pill"
              onClick={() => {
                setActiveForm((prev) => prev - 1);
              }}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-dark px-lg-5 px-4  ms-auto d-block rounded-pill next-btn"
              onClick={(e: any) => saveLanguage(e)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdminLanguage;
