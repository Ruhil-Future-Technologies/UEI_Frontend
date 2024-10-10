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
  useTheme,
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

const StudentHobbies = ({ save }: { save: boolean }) => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const { getData, postData, putData, deleteData } = useApi();
  const theme = useTheme();
  const [allHobbies, setAllHobbies] = useState<Hobby[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [initialAdminState, setInitialState] = useState<any | null>([]);
  const [editFlag, setEditFlag] = useState<boolean>(false);

  let StudentId = localStorage.getItem("_id");

  useEffect(() => {
    if (save) {
      submitHandle();
    }
  }, [save]);

  useEffect(() => {
    getData("hobby/list")
      .then((data: any) => {
        if (data?.status === 200) {
          const filteredData = data?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setAllHobbies(filteredData || []);
          // setAllHobbies(data?.data);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center"
        });
      });

    getData("student_hobby/edit/" + StudentId)
      .then((data: any) => {
        if (data?.status === 200) {
          const hobbyIds = data.data.map(
            (selecthobby: any) => selecthobby.hobby_id
          );
          setSelectedHobbies(hobbyIds);
          setInitialState(hobbyIds);
        } else if (data?.status === 404) {
          setEditFlag(true);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center"
        });
      });
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof selectedHobbies>) => {
    setSelectedHobbies(event.target.value as string[]);
  };
  //   const handleChange = (event: SelectChangeEvent<string[]>, allHobbies: any[]) => {
  //     setSelectedHobbies(event.target.value as string[]);
  //     const selectedHobbiesIds = event.target.value;
  //     const uncheckedHobbyId = allHobbies.find(hobby => !selectedHobbiesIds.includes(hobby.id));
  //     if (uncheckedHobbyId) {
  //         // Call your function with the unchecked hobby id
  //         // yourFunction(uncheckedHobbyId);
  //         console.log("Check", uncheckedHobbyId,allHobbies);

  //     }
  // };

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
        return putData("student_hobby/edit/" + StudentId, payload);
      } else {
        return Promise.resolve({ status: 204 }); // Skip update
      }
    });
    // <<<<<<< Updated upstream
    //     if(payloadPromises.length >0)
    //       {
    //         try {
    //           await Promise.all(payloadPromises);
    //           toast.success("Hobbies saved successfully!!", {
    //             hideProgressBar: true,
    //             theme: "colored",
    //           });
    //         } catch (e) {
    //           toast.error("An error occurred while saving hobbies", {
    //             hideProgressBar: true,
    //             theme: "colored",
    //           });
    //         }
    //       }
    // =======

    try {
      const results = await Promise.all(payloadPromises);
      const successfulResults = results.filter((res) => res.status === 200);
      if (successfulResults?.length > 0) {
        if (editFlag) {
          toast.success("Hobbies saved successfully", {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center"
          });
        } else {
          toast.success("Hobbies update successfully", {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center"
          });
        }
      } else if (results.some((res) => res.status !== 204)) {
        // toast.error("Some data failed to save", {
        //     hideProgressBar: true,
        //     theme: "colored",
        // });
      } else {
        //empty
      }
    } catch (e) {
      toast.error("An error occurred while saving hobbies", {
        hideProgressBar: true,
        theme: "colored",
        position: "top-center"
      });
    }
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
        if (data?.status === 200) {
          // const filteredData = data?.data?.filter((item:any) => item?.is_active === 1);
          // setAllHobbies(filteredData ||[]);
          // setAllHobbies(data?.data);
          // toast.error(data?.message, {
          //   hideProgressBar: true,
          //   theme: "colored",
          // });
        }
      })
      .catch((e) => {
        // toast.error(e?.message, {
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
      });
  };
  const handleCheckboxClick = (event: any, hobbyId: string) => {
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
          <FormControl sx={{
               maxWidth: "300px",
               width: "100%",
          }}>
            <InputLabel id="demo-multiple-checkbox-label">Hobby</InputLabel>
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
              {allHobbies.map((hobby: any) => (
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
      {/* Optional save button */}
      {/* <div className="row justify-content-center mt-3">
        <div className="col-12 d-flex justify-content-center">
          <button className="btn btn-primary">Save</button>
        </div>
      </div> */}
    </form>
  );
};

export default StudentHobbies;
