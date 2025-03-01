import React, { useContext, useEffect, useState } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  SelectChangeEvent,
  // useTheme,
} from '@mui/material';
import { toast } from 'react-toastify';
import useApi from '../../hooks/useAPI';
import 'react-toastify/dist/ReactToastify.css';
import {
  deepEqual,
  fieldIcon,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from '../../utils/helpers';
import NameContext from '../Context/NameContext';

interface Hobby {
  hobby_name: string;
  id: number;
  is_active: number;
}
interface StudentHobbiesProps {
  save: boolean;
  setSave: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHobbiesUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  isLanguageUpdated: boolean;
}
const StudentHobbies: React.FC<StudentHobbiesProps> = ({
  save,
  setSave,
  setIsHobbiesUpdated,
  isLanguageUpdated,
}) => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;

  const { getData, postData, putData, deleteData } = useApi();
  //const theme = useTheme();
  const [ishobbiestuch, setIshobbiestuch] = useState(false);
  const [allHobbies, setAllHobbies] = useState<Hobby[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [initialAdminState, setInitialState] = useState<any | null>([]);
  const [editFlag, setEditFlag] = useState<boolean>(false);
  const [hobbiesAll, setHobbiesAll] = useState<any>([]);
  const StudentId = localStorage.getItem('_id');
  //const userUUID=localStorage.getItem('user_uuid');

  useEffect(() => {
    if (save) {
      submitHandle();
    }
  }, [save]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hobbyListData = await getData('hobby/list');

        if (hobbyListData?.status) {
          const filteredData = hobbyListData?.data?.hobby_data?.filter(
            (item: any) => item?.is_active,
          );
          setAllHobbies(filteredData || []);
        }

        const studentHobbyData = await getData(`student_hobby/edit/${StudentId}`)
    
   console.log(studentHobbyData.data?.hobby)
        if (studentHobbyData?.status) {
          const hobbyIds = studentHobbyData.data?.hobby?.map(
            (selecthobby: any) => selecthobby.hobby_id,
          );
          setSelectedHobbies(hobbyIds);
          setInitialState(hobbyIds);
          setHobbiesAll(studentHobbyData?.data?.hobby || []);
        } else if (studentHobbyData?.code === 404) {
          setEditFlag(true);
        }
      } catch (e: any) {
        toast.error(e?.message || 'An error occurred', {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      }
    };

    if(StudentId){
      fetchData();
    }
   
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof selectedHobbies>) => {
    Promise.resolve(setIsHobbiesUpdated(true));
    setSelectedHobbies(event.target.value as string[]);
    setIshobbiestuch(true);
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

    const payloadPromises = selectedHobbies.map((hobbyid) => {
      const formData = new FormData();
      const payload = {
        student_id: StudentId,
        hobby_id: hobbyid,
      } as any;
      const hobbyExists = hobbiesAll?.some(
        (item: { hobby_id: any }) => item?.hobby_id === hobbyid,
      );

      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });

      if (ishobbiestuch) {
        if (editFlag || !hobbyExists) {
          return postData('student_hobby/add', formData);
        } else if (!eq) {
          return putData('student_hobby/edit/' + StudentId, formData);
        } else {
          return Promise.resolve({ code: 204 }); // Skip update
        }
      } else {
        return Promise.resolve({ code: 204 });
      }
    });
    try {
      const results = await Promise.all(payloadPromises);
      const successfulResults = results.filter((res) => res.code === 200);

      if (successfulResults?.length > 0) {
        if (!isLanguageUpdated && ishobbiestuch) {
          if (editFlag) {
            toast.success('Hobbies saved successfully', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });

            setIshobbiestuch(false);
          } else {
            toast.success('Hobbies updated successfully', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
            setIshobbiestuch(false);
          }
        } else {
          setIshobbiestuch(false);
        }
      } else if (results.some((res) => res.code !== 204)) {
        // toast.error("Some data failed to save", {
        //     hideProgressBar: true,
        //     theme: "colored",
        // });
      } else {
        //empty
      }
    } catch {
      toast.error('An error occurred while saving hobbies', {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
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
    const deleteHob = hobbiesAll?.filter(
      (item: { hobby_id: any }) => item?.hobby_id == id,
    );
    if (deleteHob[0]?.id) {
      deleteData('/student_hobby/delete/' + deleteHob[0]?.id)
        .then((data: any) => {
          if (data?.status) {
            // const filteredData = data?.data?.filter((item:any) => item?.is_active === 1);
            // setAllHobbies(filteredData ||[]);
            // setAllHobbies(data?.data);
            // toast.error(data?.message, {
            //   hideProgressBar: true,
            //   theme: "colored",
            // });
          }
        })
        .catch(() => {
          // toast.error(e?.message, {
          //   hideProgressBar: true,
          //   theme: "colored",
          // });
        });
    }
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
          <FormControl
            sx={{
              maxWidth: '300px',
              width: '100%',
            }}
          >
            <InputLabel id="demo-multiple-checkbox-label">Hobby</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              data-testid="hobby_text"
              sx={{
                backgroundColor: '#f5f5f5',
                '& .MuiSelect-icon': {
                  color: fieldIcon(namecolor),
                },
              }}
              value={selectedHobbies}
              onChange={handleChange}
              // onChange={(event) => handleChange(event, allHobbies)}
              input={<OutlinedInput label="Hobby" />}
              renderValue={(selected) =>
                (selected as string[])
                  .map((id) => {
                    const hobby = allHobbies.find(
                      (hobby: any) => hobby.id === id,
                    );
                    return hobby ? hobby.hobby_name : '';
                  })
                  // .join(", ")
                  .reduce(
                    (prev, curr) => (prev === '' ? curr : `${prev}, ${curr}`),
                    '',
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
                    // "&:hover": {
                    //   backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    // },
                    '&:hover': {
                      backgroundColor: inputfieldhover(namecolor),
                      color: 'black !important',
                    },
                    '&.Mui-selected': {
                      // backgroundColor: inputfield(namecolor),
                      color: 'black',
                    },
                    '&.Mui-selected, &:focus': {
                      backgroundColor: inputfield(namecolor),
                      color: namecolor === 'dark' ? 'white' : 'black',
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
