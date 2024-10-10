
import React, { useContext, useEffect, useState } from "react";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useAPI";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import StudentHobbies from "../StudentHobbies";
import { deepEqual, inputfield, inputfieldhover, inputfieldtext, tabletools } from "../../utils/helpers";
import NameContext from "../Context/NameContext";

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
  theme: any
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

interface Box {
  id: number;
  language_id: any;
  proficiency: any;
}

function StudentLanguage() {
  const context = useContext(NameContext);
  const {namecolor }:any = context;
  let StudentId = localStorage.getItem("_id");
  const { getData, postData, putData, deleteData } = useApi();

  const theme = useTheme();
  const [alllanguage, setAllLanguage] = useState<Language[]>([]);
  const [selectedLeng, setSelectedLeng] = useState<any>();
  const [editFalg, setEditFlag] = useState<boolean>(false);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [isSave, setIsSave] = useState<boolean>(false);
  const [proficiency, setProficiency] = useState<any>("read");
  const [initialAdminState,setInitialState]=useState<any | null>([])

  const addRow = () => {
    setBoxes((prevBoxes) => [
      ...prevBoxes,
      { id: 0, language_id: "", proficiency: "" },
    ]);
  };

  const deleterow = (id: any, indx: number) => {
    if (id !== 0) {
      deleteData(`/student_language_knowndelete/${id}`)
        .then((data: any) => {
         if(data.status === 200){
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
    setBoxes(boxes.filter((box, index) => index !== indx));
  };
  const getdatalanguage = async () => {
  getData(`student_language_known/edit/${StudentId}`)
  .then((data: any) => {
    if (data?.status === 200) {
      const lenduageIds = data.data.language_id;
      setSelectedLeng(lenduageIds);
      data.data.forEach((item: any) => {
        const newBox: Box = {
          id: item.id,
          language_id: item.language_id,
          proficiency: item.proficiency,
        };
        if (!boxes.some((box) => box.id === newBox.id)) {
          setBoxes((prevBoxes) => [...prevBoxes, newBox]);
          setInitialState((prevBoxes: any) => [...prevBoxes, newBox])
        }
      });
    } else if (data?.status === 404) {
      setBoxes([{ id: 0, language_id: "", proficiency: "" }]);
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
  }
  useEffect(() => {
    getData("language/list")
      .then((data: any) => {
        if (data?.status === 200) {
          const filteredData = data?.data?.filter((item:any) => item?.is_active === 1);
          setAllLanguage(filteredData ||[]);
          // setAllLanguage(data?.data);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
      getdatalanguage()
  }, []);

  const saveLanguage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSave(true);
    // console.log("saving",initialAdminState,boxes)
    const eq = deepEqual(initialAdminState,boxes)
  
    const promises = boxes.map((box) => {
      const payload = {
        student_id: StudentId,
        language_id: box.language_id,
        proficiency: box.proficiency,
      };
      if (editFalg || box.id === 0) {
        return postData("student_language_known/add", payload);
      } else if (!eq) {
        return putData("student_language_known/edit/" + box.id, payload);
    } else {
        return Promise.resolve({ status: 204 }); // Skip update
    }
    });

    try {
      const results:any = await Promise.all(promises);
      // const allSuccess = results.every((res) => res.status === 200);
      // if (allSuccess) {
      //   toast.success("language Known updated successfully", {
      //     hideProgressBar: true,
      //     theme: "colored",
      //   });
      // } else {
      //   toast.error("Some data failed to save", {
      //     hideProgressBar: true,
      //     theme: "colored",
      //   });
      // }
      const successfulResults = results.filter((res: { status: number; }) => res.status === 200);
        
      if (successfulResults?.length > 0) {
        if(editFalg){
          toast.success("Language saved successfully", {
            hideProgressBar: true,
            theme: "colored",
        });
        }else{

          toast.success("Language updated successfully", {
              hideProgressBar: true,
              theme: "colored",
          });
        }
          // getdatalanguage()
      } else if (results.some((res: { status: number; }) => res.status !== 204)) {
          // toast.error("Some data failed to save", {
          //     hideProgressBar: true,
          //     theme: "colored",
          // });
      }else{
        //empty
      }
    } catch (error: any) {
      toast.error(error?.message, {
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  const handleChange = (event: SelectChangeEvent<string>, index: number) => {
    const { value } = event.target;
    setBoxes((prevBoxes) =>
      prevBoxes.map((box, i) =>
        i === index ? { ...box, language_id: value } : box
      )
    );
  };

  const handleChange1 = (event: SelectChangeEvent<string>, index: number) => {
    const { value } = event.target;
    setBoxes((prevBoxes) =>
      prevBoxes.map((box, i) =>
        i === index ? { ...box, proficiency: value } : box
      )
    );
  };

  return (
    <>
      <div className="row mt-5">
        <div className="col-12">
          <h5 className="font-weight-bold profiletext">
            <b> Hobbies</b>
          </h5>
        </div>
      </div>
      <div className="row mt-3 form_field_wrapper">
        <StudentHobbies save={isSave}></StudentHobbies>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <h5 className="font-weight-bold profiletext">
            <b> Language Known</b>
          </h5>
        </div>
      </div>
      <form onSubmit={saveLanguage}>
        {boxes.map((box, index) => (
          <div className="row d-flex justify-content-start align-items-center mt-4 " key={index}>
            <div className="col-md-4 form_field_wrapper ">
              <FormControl required sx={{ m: 1, minWidth: 320, width: "100%" }}>
                <InputLabel id={`language-label-${box.id}`}>Language</InputLabel>
                <Select
                  labelId={`language-label-${box.id}`}
                  id={`language-select-${box.id}`}
                  name={`language_${box.id}`}
                  value={box.language_id}
                  label="language *"
                  onChange={(e) => handleChange(e, index)}
                  MenuProps={MenuProps}
                >
                  {alllanguage.map((lang) => (
                    <MenuItem key={lang.id} value={lang.id}
                    sx={{
                      backgroundColor: inputfield(namecolor),
                      color: inputfieldtext(namecolor),
                      '&:hover': {
                          backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                      },
                  }}>
                      {lang.language_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-md-4 col-sm-3 form_field_wrapper">
              <FormControl required sx={{ m: 1, minWidth: 220, width: "100%" }}>
                <InputLabel id={`proficiency-label-${box.id}`}>Proficiency</InputLabel>
                <Select
                  labelId={`proficiency-label-${box.id}`}
                  id={`proficiency-select-${box.id}`}
                  name={`proficiency_${box.id}`}
                  value={box.proficiency}
                  label="proficiency *"
                  onChange={(e) => handleChange1(e, index)}
                  MenuProps={MenuProps}
                >
                  <MenuItem value={"read"}
                   sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    '&:hover': {
                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                }}>Read</MenuItem>
                  <MenuItem value={"write"}
                   sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    '&:hover': {
                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                }}>Write</MenuItem>
                  <MenuItem value={"both"}
                   sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    '&:hover': {
                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                }}>Both</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-md-4 col-sm-3 form_field_wrapper">
              <IconButton onClick={addRow} sx={{ width: "35px", height: "35px" , color: tabletools(namecolor) }}>
                <AddIcon />
              </IconButton>
              {boxes.length !== 1 && (
                <IconButton
                  onClick={() => deleterow(box.id, index)}
                  sx={{ width: "35px", height: "35px",  color: tabletools(namecolor)}}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          </div>
        ))}
        <div className="row justify-content-center">
          <div className="col-md-12 d-flex justify-content-center">
            <Button className="btn btn-primary mainbutton" type="submit" style={{ marginTop: "25px" }}>
            {editFalg ? "save" : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}


export default StudentLanguage;

