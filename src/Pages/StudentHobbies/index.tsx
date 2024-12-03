/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  SelectChangeEvent,
} from "@mui/material";
import { toast } from "react-toastify";
import useApi from "../../hooks/useAPI";
import "react-toastify/dist/ReactToastify.css";
import {
  deepEqual,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from "../../utils/helpers";
import NameContext from "../Context/NameContext";

interface Hobby {
  hobby_name: string;
  id: number;
  is_active: number;
}
interface StudentHobbiesProps {
  save: boolean;
  setSave: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHobbiesUpdated:React.Dispatch<React.SetStateAction<boolean>>;
  isLanguageUpdated:boolean;
}
const StudentHobbies : React.FC<StudentHobbiesProps> = ({ save, setSave,setIsHobbiesUpdated,isLanguageUpdated }) => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const { getData, postData, putData, deleteData } = useApi();
  const [allHobbies, setAllHobbies] = useState<Hobby[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [initialAdminState, setInitialState] = useState<any | null>([]);
  const [editFlag, setEditFlag] = useState<boolean>(false);


  let StudentId = localStorage.getItem("_id");
  
  useEffect(() => {
    console.log(save);
    if (save) {
      submitHandle();
    }
  }, [save]);

  useEffect(() => {

    const fetchHobbyList = async () => {
      try {
        const data: any = await getData("hobby/list");

        if (data?.status === 200) {
          const filteredData = data?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setAllHobbies(filteredData || []);
        }
      } catch (e: any) {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center",
        });

      }
    };
  
    const fetchStudentHobbies = async () => {
      try {
        const data: any = await getData("student_hobby/edit/" + StudentId);

        if (data?.status === 200) {
          const hobbyIds = data.data.map(
            (selecthobby: any) => selecthobby.hobby_id
          );
          setSelectedHobbies(hobbyIds);
          setInitialState(hobbyIds);
        } else if (data?.status === 404) {
          setEditFlag(true);
        }
      } catch (e: any) {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center",
        });
      }
    };
  
    fetchHobbyList();
    fetchStudentHobbies();
  }, [StudentId]);
  
  const handleChange = (event: SelectChangeEvent<typeof selectedHobbies>) => {
    Promise.resolve(setIsHobbiesUpdated(true));
    setSelectedHobbies(event.target.value as string[]);
  };

  const submitHandle = async () => {
    
    const eq = deepEqual(initialAdminState, selectedHobbies);

    let payloadPromises = selectedHobbies.map((hobbyid) => {
      let payload = {
        student_id: StudentId,
        hobby_id: hobbyid,
      };

      // return editFlag
      //   ? postData("student_hobby/add", payload)
      //   : putData("student_hobby/edit/" + StudentId, payload);

      if (editFlag) {
        return postData("student_hobby/add", payload);
      } else if (!eq) {
        console.log("edit hobby");
        return putData("student_hobby/edit/" + StudentId, payload);
      } else {
        return Promise.resolve({ status: 204 }); // Skip update
      }
    });

    try {
      const results = await Promise.all(payloadPromises);
      const successfulResults = results.filter((res) => res.status === 200);
      console.log(successfulResults);
      console.log(results);
      console.log(payloadPromises);
      console.log(successfulResults);
      if (successfulResults?.length > 0) {
        console.log(successfulResults);
        if(!isLanguageUpdated){
           if (editFlag) {
          toast.success("Hobbies saved successfully", {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center",
          });
        }else {
          toast.success("Hobbies update successfully", {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center",
          });
        }
        }
       
      } else if (results.some((res) => res.status !== 204)) {
        // toast.error("Some data failed to save", {
        //     hideProgressBar: true,
        //     theme: "colored",
        // });
      } else {
        //empty
      }
    } catch {
      toast.error("An error occurred while saving hobbies", {
        hideProgressBar: true,
        theme: "colored",
        position: "top-center",
      });
    }

    setSave(false);
    // >>>>>>> Stashed changes

  };

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
  const hobbydelete = (id: any) => {
    deleteData("/student_hobby/delete/" + id)
      .then((data: any) => {
        console.log(data);
        if (data?.status === 200) {
          // const filteredData = data?.data?.filter((item:any) => item?.is_active === 1);
        }
      })
      .catch(() => {
        // toast.error(e?.message, {
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
      });
  };
  const handleCheckboxClick = (event: any, hobbyId: string) => {
    console.log(event.target.checked);
    if (!event.target.checked) {
      // Call your function when checkbox is unchecked
      hobbydelete(hobbyId);
      // console.log("Check", event.target.checked, hobbyId);
    }
  };

  return (
    <form onSubmit={submitHandle}>
      <div className="row justify-content-start">
        <div className="col-12 justify-content-start form_field_wrapper">
          <FormControl
            sx={{
              maxWidth: "300px",
              width: "100%",
            }}
          >
            <InputLabel data-testid="hobby_text" id="demo-multiple-checkbox-label">Hobby</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              sx={{
                backgroundColor: "#f5f5f5",
              }}
              value={selectedHobbies}
              onChange={handleChange}
              // onChange={(event) => handleChange(event, allHobbies)}
              input={<OutlinedInput label="Hobby" />}
              renderValue={(selected) =>
                (selected as string[])
                  .map((id) => {
                    const hobby = allHobbies.find(
                      (hobby: any) => hobby.id === id
                    );
                    return hobby ? hobby.hobby_name : "";
                  })
                  // .join(", ")
                  .reduce(
                    (prev, curr) => (prev === "" ? curr : `${prev}, ${curr}`),
                    ""
                  )
              }
              MenuProps={MenuProps}
            >
              {allHobbies?.map((hobby: any) => (
                <MenuItem
                  key={hobby.id}
                  value={hobby.id}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  <Checkbox
                    checked={selectedHobbies.indexOf(hobby.id) > -1}
                    onClick={(event) => handleCheckboxClick(event, hobby.id)}
                  />
                  <ListItemText primary={hobby.hobby_name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </form>
  );
};

export default StudentHobbies;
