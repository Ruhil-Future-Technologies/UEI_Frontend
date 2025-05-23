/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useTheme } from '../../ThemeProvider';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import useApi from '../../hooks/useAPI';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';
import NameContext from '../Context/NameContext';
import {
  inputfield,
  inputfieldhover,
  inputfieldtext,
  tabletools,
} from '../../utils/helpers';
import { ChildComponentProps } from '../StudentProfile';
import { QUERY_KEYS_CLASS, QUERY_KEYS_COURSE } from '../../utils/const';

interface Box {
  id: number;
  institution_id: string;
  course_id: string;
  starting_date: any;
  ending_date: any;
  learning_style: string;
  class_id: string;
}
interface Boxset {
  id: number;
  Institute_Name_Add: string;
}
interface Institute {
  id: number;
  institution_id: string;
  institution_name: string;
}

interface Course {
  id: number;
  course_name: string;
  course_id: string;
}
interface Classes {
  id: number;
  class_name: string;
  class_id: string;
}

const Boxsetvalue = {
  id: 0,
  Institute_Name_Add: '',
};

const StudentAcademicHistory: React.FC<ChildComponentProps> = ({
  setActiveForm,
}) => {
  useTheme();
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const ClassURL = QUERY_KEYS_CLASS.GET_CLASS;
  const CourseURL = QUERY_KEYS_COURSE.GET_COURSE;
  const { getData, postData, putData, deleteData } = useApi();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [boxes1, setBoxes1] = useState<Boxset[]>([Boxsetvalue]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [editFlag, setEditFlag] = useState<boolean>(false);
  const [enddateInvalidList, setEnddateInvalidList] = useState<boolean[]>([]);

  const StudentId = localStorage.getItem('user_uuid');
  const addRow = () => {
    const newBox: Box = {
      id: 0,
      institution_id: '',
      course_id: '',
      starting_date: null,
      ending_date: null,
      learning_style: '',
      class_id: '',
    };
    setBoxes([...boxes, newBox]);
  };

  const deleterow = (id: number, indx: number) => {
    if (id !== 0) {
      deleteData(`/student_academic_historydelete/${id}`)
        .then((data: any) => {
          if (data.code === 200) {
            toast.success('Academic history deleted successfully', {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    }
    setBoxes(boxes.filter((_box, index) => index !== indx));
  };
  const listData = async () => {
    return new Promise((resolve) => {
      getData('/institute/list')
        .then(async (response: any) => {
          if (response.status) {
            const filteredData = await response?.data?.filter(
              (item: any) => item?.is_active === 1,
            );
            setInstitutes(filteredData || []);
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          toast.error(error?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });

          resolve(false);
        });
    });
  };
  useEffect(() => {
    listData();

    getData(`${CourseURL}`)
      .then((response: any) => {
        if (response.status) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === 1,
          );
          setCourses(filteredData || []);
          // setCourses(response.data);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
    getData(`${ClassURL}`)
      .then((response: any) => {
        if (response.status) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === true,
          );
          setClasses(filteredData || []);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });

    getData(`${'student_academic_history/edit/' + StudentId}`)
      .then((data: any) => {
        if (data?.status) {
          data?.data?.forEach((item: any) => {
            const newBox = {
              id: item?.id,
              institution_id: item?.institution_id,
              course_id: item?.course_id,
              starting_date: item?.starting_date
                ? dayjs(item?.starting_date)
                : null,
              ending_date: item?.ending_date ? dayjs(item?.ending_date) : null,
              learning_style: item?.learning_style,
              class_id: item?.class_id,
            };
            if (!boxes.some((box) => box.id === newBox.id)) {
              setBoxes((prevBoxes) => [...prevBoxes, newBox]);
            }
          });
        } else if (data?.code === 404) {
          setBoxes([
            {
              id: 0,
              institution_id: '',
              course_id: '',
              starting_date: null,
              ending_date: null,
              learning_style: '',
              class_id: '',
            },
          ]);
          setEditFlag(true);
        } else {
          console.error('Unexpected response:', data);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  }, []);

  const saveAcademicHistory = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const validatePayload = (
      payload: { [s: string]: unknown } | ArrayLike<unknown>,
    ) => {
      return Object.values(payload).every((value) => value !== '');
    };

    const isDateValid = (starting_date: string, ending_date: string) => {
      return (
        dayjs(starting_date).isBefore(dayjs(ending_date)) ||
        dayjs(starting_date).isSame(dayjs(ending_date))
      );
    };
    const promises = boxes
      .map((box) => {
        const formData = new FormData();
        const payload = {
          student_id: StudentId,
          institution_id: String(box.institution_id),
          course_id: String(box.course_id),
          starting_date: box.starting_date,
          ending_date: box.ending_date,
          learning_style: box.learning_style,
          class_id: String(box.class_id),
        } as any;

        Object.keys(payload).forEach((key) => {
          formData.append(key, payload[key]);
        });

        if (
          validatePayload(payload) &&
          isDateValid(box.starting_date, box.ending_date)
        ) {
          if (editFlag || box.id === 0) {
            return postData('/student_academic_history/add', formData);
          } else {
            return putData(
              '/student_academic_history/edit/' + box.id,
              formData,
            );
          }
        } else {
          return Promise.resolve(null); // If payload is invalid, return a resolved promise
        }
      })
      .filter((promise) => promise !== null);

    Promise.all(promises)
      .then((responses) => {
        const allSuccessful = responses.every(
          (response) => response?.code === 200,
        );

        if (allSuccessful) {
          toast.success('Academic history saved successfully', {
            hideProgressBar: true,
            theme: 'colored',
          });
        } else {
          // toast.error("An error occurred while saving", {
          //   hideProgressBar: true,
          //   theme: "colored",
          // });
        }
      })
      .catch((error) => {
        // Handle error
        console.error('Error processing payloads:', error);
        // toast.error("An error occurred while saving", {
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
      });
  };

  const saveAcademi = async (index: number) => {
    try {
      const validatePayload = (
        payload: { [s: string]: unknown } | ArrayLike<unknown>,
      ) => {
        return Object.values(payload).every((value) => value !== '');
      };

      const promises = boxes1
        .map((box) => {
          const formData = new FormData();
          const payload = {
            institution_name: box.Institute_Name_Add,
          };
          formData.append('institute_name', payload.institution_name);
          if (validatePayload(payload)) {
            if (editFlag || box.id === 0) {
              return postData('/institution/add', formData);
            } else {
              return postData('/institution/add', formData);
            }
          } else {
            return Promise.resolve(null);
          }
        })
        .filter((promise) => promise !== null);

      const responses = await Promise.all(promises);

      const allSuccessful = responses.every(
        (response) => response?.code === 200,
      );

      if (allSuccessful) {
        const newBoxes: any = [...boxes];
        newBoxes[index]['institution_id'] = responses[0].institution.id;
        setBoxes(newBoxes);
        setBoxes1([
          {
            id: 0,
            Institute_Name_Add: '',
          },
        ]);

        console.log('response', responses[0].institution.id);
        await listData();
        toast.success('Institution name saved successfully', {
          hideProgressBar: true,
          theme: 'colored',
        });
        // setDataInsitute(boxes1[0]?.Institute_Name_Add);
      }
    } catch (error) {
      console.error('Error while saving academia:', error);
      toast.error('Error while saving institution name', {
        hideProgressBar: true,
        theme: 'colored',
      });
    }
  };

  const handleInputChange = (
    index: number,
    field: keyof Box,
    value: string | dayjs.Dayjs | null,
  ) => {
    const newBoxes = [...boxes];
    newBoxes[index] = { ...newBoxes[index], [field]: value };

    // Check date validity
    const startDate = dayjs(newBoxes[index].starting_date);
    const endDate = dayjs(newBoxes[index].ending_date);

    const newEnddateInvalidList = [...enddateInvalidList];
    if (
      startDate.isValid() &&
      endDate.isValid() &&
      endDate.isBefore(startDate)
    ) {
      newEnddateInvalidList[index] = true;
    } else {
      newEnddateInvalidList[index] = false;
    }

    setBoxes(newBoxes);
    setEnddateInvalidList(newEnddateInvalidList);
  };
  const handleInputChange1 = (
    index: number,
    field: keyof Boxset,
    value: any,
  ) => {
    // setenddateInvalid(value)
    const newBoxes: any = [...boxes1];
    newBoxes[index][field] = value;
    setBoxes1(newBoxes);
  };
  
  return (
    <div className="mt-5">
      <form onSubmit={saveAcademicHistory}>
        {boxes?.map((box, index) => (
          <div
            className="row align-items-center"
            key={box.id}
            style={{ marginBottom: '5px' }}
          >
            <div className="col form_field_wrapper">
              <FormControl required sx={{ m: 1, minWidth: 220, width: '100%' }}>
                <InputLabel>Institute Name</InputLabel>
                <Select
                  name="institution_id"
                  value={box.institution_id}
                  sx={{
                    backgroundColor: '#f5f5f5',
                  }}
                  onChange={(e) =>
                    handleInputChange(index, 'institution_id', e.target.value)
                  }
                  label="Institute Name"
                >
                  {institutes.map((institute) => (
                    <MenuItem
                      key={institute.id}
                      value={institute.id}
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        '&:hover': {
                          backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                        },
                      }}
                    >
                      {institute.institution_name}
                    </MenuItem>
                  ))}
                  <MenuItem
                    key={1}
                    value={1}
                    sx={{
                      backgroundColor: inputfield(namecolor),
                      color: inputfieldtext(namecolor),
                      '&:hover': {
                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                      },
                    }}
                  >
                    Others
                  </MenuItem>
                </Select>
                {/* <div> {!box.institution_id && (
                        <p style={{ marginLeft: "10px", color: 'red' }}>Please select a Department name.</p>
                    )}</div> */}
              </FormControl>
              {box.institution_id == '1' && (
                <>
                  <FormControl sx={{ m: 1, minWidth: 180, width: '100%' }}>
                    {boxes1.map((box, index) => (
                      <TextField
                        key={box.id}
                        name="Institute_Name_Add"
                        value={box.Institute_Name_Add}
                        onChange={(e) =>
                          handleInputChange1(
                            index,
                            'Institute_Name_Add',
                            e.target.value,
                          )
                        }
                        label="Institute Name Add"
                      />
                    ))}
                  </FormControl>
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => saveAcademi(index)}
                      style={{ marginTop: '25px' }}
                    >
                      Save Institute Name
                    </Button>
                  </div>
                </>
              )}
            </div>
            <div className="col form_field_wrapper">
              <FormControl required sx={{ m: 1, minWidth: 220, width: '100%' }}>
                <InputLabel>Course</InputLabel>
                <Select
                  value={box.course_id}
                  sx={{
                    backgroundColor: '#f5f5f5',
                  }}
                  onChange={(e) =>
                    handleInputChange(index, 'course_id', e.target.value)
                  }
                  label="Course"
                >
                  {courses.map((course) => (
                    <MenuItem
                      key={course.id}
                      value={course.id}
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        '&:hover': {
                          backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                        },
                      }}
                    >
                      {course.course_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col form_field_wrapper">
              <FormControl required sx={{ m: 1, minWidth: 220, width: '100%' }}>
                <InputLabel>Class</InputLabel>
                <Select
                  sx={{
                    backgroundColor: '#f5f5f5',
                  }}
                  value={box.class_id}
                  onChange={(e) =>
                    handleInputChange(index, 'class_id', e.target.value)
                  }
                  label="Class"
                >
                  {classes.map((classes) => (
                    <MenuItem
                      key={classes.id}
                      value={classes.id}
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        '&:hover': {
                          backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                        },
                      }}
                    >
                      {classes.class_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col form_field_wrapper">
              <FormControl required sx={{ m: 1, minWidth: 180, width: '100%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    label="Starting Date *"
                    value={dayjs(box.starting_date)}
                    onChange={(date) =>
                      handleInputChange(index, 'starting_date', date)
                    }
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
            <div className="col form_field_wrapper">
              <FormControl required sx={{ m: 1, minWidth: 180, width: '100%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="DD/MM/YYYY"
                    label="Completion Date *"
                    value={dayjs(box.ending_date)}
                    onChange={(date) =>
                      handleInputChange(index, 'ending_date', date)
                    }
                  />
                </LocalizationProvider>
              </FormControl>
              {enddateInvalidList[index] && (
                <p style={{ color: 'red' }}>
                  Completion Date must be greater than Starting Date.
                </p>
              )}
            </div>
            <div className="col form_field_wrapper">
              <FormControl
                required
                sx={{ m: 1, minWidth: 70, width: '100%', maxWidth: 200 }}
              >
                <InputLabel>Learning Style</InputLabel>
                <Select
                  value={box.learning_style}
                  onChange={(e) =>
                    handleInputChange(index, 'learning_style', e.target.value)
                  }
                  label="Learning Style"
                >
                  <MenuItem
                    value="online"
                    sx={{
                      backgroundColor: inputfield(namecolor),
                      color: inputfieldtext(namecolor),
                      '&:hover': {
                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                      },
                    }}
                  >
                    Online
                  </MenuItem>
                  <MenuItem
                    value="offline"
                    sx={{
                      backgroundColor: inputfield(namecolor),
                      color: inputfieldtext(namecolor),
                      '&:hover': {
                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                      },
                    }}
                  >
                    Offline
                  </MenuItem>
                  <MenuItem
                    value="any"
                    sx={{
                      backgroundColor: inputfield(namecolor),
                      color: inputfieldtext(namecolor),
                      '&:hover': {
                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                      },
                    }}
                  >
                    Any
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="col-1">
              <IconButton
                onClick={addRow}
                sx={{
                  width: '35px',
                  height: '35px',
                  color: tabletools(namecolor),
                }}
              >
                <AddIcon />
              </IconButton>
              {boxes.length !== 1 && (
                <IconButton
                  onClick={() => deleterow(box.id, index)}
                  sx={{
                    width: '35px',
                    height: '35px',
                    color: tabletools(namecolor),
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          </div>
        ))}
        <div className="row justify-content-center">
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
              className="btn btn-dark px-lg-5  ms-auto d-block rounded-pill next-btn"
              onClick={() => {
                setActiveForm((prev) => prev + 1);
              }}
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentAcademicHistory;
