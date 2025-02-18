import React, { useContext, useEffect, useState } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import 'react-toastify/dist/ReactToastify.css';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import useApi from '../../hooks/useAPI';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';
import NameContext from '../Context/NameContext';
import {
  commonStyle,
  fieldIcon,
  // inputfield,
  // inputfieldhover,
  // inputfieldtext,
  // deepEqual,
} from '../../utils/helpers';
import { State } from 'country-state-city';
import { ChildComponentProps } from '../StudentProfile';

export interface Box {
  errors?: any;
  id: number;
  institute_type: string;
  board: string;
  state_for_stateboard: string;
  institute_id: string;
  course_id: string | number;
  learning_style: string;
  class_id: string;
  year: any;
  stream: string;
  university_id?: string;
  // sem_id: string;
  sem_id?: string | number;
}
interface Boxset {
  id: number;
  Institute_Name_Add: string;
}
interface Institute {
  id: number;
  institute_id: string;
  institution_name: string;
  university_id: string | number;
  is_active?: number;
  is_approve?: boolean;
}

interface Course {
  id: number;
  course_name: string;
  course_id: string;
  institution_id: string;
}
interface University {
  id: number;
  university_name: string;
  university_id: string;
}

interface Semester {
  id: number;
  semester_number: string;
  sem_id: string;
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
interface Option {
  value: string;
  label: string;
}

const AcademicHistory: React.FC<ChildComponentProps> = ({
  setActiveForm,
  activeForm,
}) => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const { getData, postData, putData } = useApi();
  const [boxes, setBoxes] = useState<Box[]>([]);
  // const [checkBoxes, setCheckBoxes] = useState<Box[]>([]);
  const [boxes1, setBoxes1] = useState<Boxset[]>([Boxsetvalue]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [institutesAll, setInstitutesAll] = useState<Institute[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesAll, setCoursesAll] = useState<Course[]>([]);
  const [university, setUniversity] = useState<University[]>([]);
  const [semester, setSemester] = useState<Semester[]>([]);
  const [totalSemester, setTotalSemester] = useState<any>([]);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [particularClass, setParticularClass] = useState('');
  const [editFlag, setEditFlag] = useState<boolean>(false);

  const [enddateInvalidList, setEnddateInvalidList] = useState<boolean[]>([]);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  // const [maxSemester, setMaxSemester] = useState(0);
  const [editAcademicHistory, setEditAcademicHistory] = useState(false);
  const [updateBoxes, setUpdateBoxes] = useState(false);
  const currentYear = dayjs().year();
  const StudentId = localStorage.getItem('user_uuid');
  const menuItems = [
    { value: 'school', label: 'School' },
    { value: 'college', label: 'College' },
  ];
  const boardItems = [
    { value: 'cbse', label: 'CBSE' },
    { value: 'icse', label: 'ICSE' },
    { value: 'state_board', label: 'State Board' },
  ];
  const stremItems = [
    { value: 'science', label: 'Science' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'arts', label: 'Arts' },
  ];
  const learningItems = [
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
    { value: 'any', label: 'Any' },
  ];
  useEffect(() => {
    const states = State.getStatesOfCountry('IN');
    const stateOptions = states.map((state) => ({
      // value: state.isoCode,
      value: state.name,
      label: state.name,
    }));
    setStateOptions(stateOptions);
  }, [State]);

  const initialErrors = {
    institute_type: '',
    board: '',
    class_id: '',
    state_for_stateboard: '',
    stream: '',
    university_id: '',
    institute_id: '',
    course_id: '',
    sem_id: '',
    learning_style: '',
    year: '',
  };

  const validateFields = (box: Box) => {
    const errors = { ...initialErrors };
    if (box?.institute_type === '') {
      if (!box?.institute_type)
        errors.institute_type = 'institute type name is required';
    }

    // Validation logic for "college"
    if (box?.institute_type === 'college') {
      if (!box?.university_id)
        errors.university_id = 'University name is required';
      if (!box?.institute_id)
        errors.institute_id = 'Institute name is required';
      if (!box?.course_id) errors.course_id = 'Course is required';
      if (!box?.sem_id) errors.sem_id = 'Semester is required';
      if (!box?.learning_style)
        errors.learning_style = 'Learning style is required';
      if (!box?.year) {
        errors.year = 'Year is required'; // Field is empty
      } else if (box.year.year() > currentYear) {
        errors.year = 'You cannot enter future dates'; // Future date
      } else {
        errors.year = ''; // Clear the error when the input is valid
      }
    }

    // Validation logic for "school"
    else if (box?.institute_type === 'school') {
      if (!box?.board) errors.board = 'Board is required';
      if (!box?.class_id) errors.class_id = 'Class is required';
      if (box?.board === 'state_board' && !box?.state_for_stateboard) {
        errors.state_for_stateboard = 'State is required';
      }
      if (
        (particularClass === 'class_11' || particularClass === 'class_12') &&
        !box?.stream
      ) {
        errors.stream = 'Stream is required';
      }
    }

    return errors;
  };

  const listData = async () => {
    return new Promise((resolve) => {
      getData('/institution/list')
        .then(async (response: any) => {
          if (response.status) {
            const filteredData = await response?.data?.filter(
              (item: any) => item?.is_active === 1,
            );

            if (boxes[0]?.institute_type === 'college') {
              const filterDataInstitute = filteredData?.filter(
                (item: any) => item?.university_id === boxes[0]?.university_id,
              );
              setInstitutes(filterDataInstitute || []);
            } else {
              setInstitutes(filteredData || []);
            }
            setInstitutesAll(filteredData || []);
            // setInstitutes(response.data);
            // return filteredData || []
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          toast.error(error?.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });

          resolve(false);
        });
    });
  };

  useEffect(() => {
    getData('university/list')
      .then((response: any) => {
        if (response.status) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === 1,
          );
          setUniversity(filteredData || []);
          // setCourses(response.data);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
    getData('/semester/list')
      .then((response: any) => {
        if (response.status) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === 1,
          );
          setSemester(filteredData || []);
          // setCourses(response.data);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });

    getData('/course/list')
      .then((response: any) => {
        if (response.status) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === 1,
          );
          setCourses(filteredData || []);
          setCoursesAll(filteredData || []);
          // setCourses(response.data);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
    getData('/class/list')
      .then((response: any) => {
        if (response.status) {
          // const filteredData = response?.data?.filter((item:any) => item?.is_active === 1);
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === true,
          );
          const getModifyClassMane = (value: string) => {
            return value?.replace('_', ' ');
          };
          const newClassObject = filteredData.map((item: any) => {
            return {
              id: item?.id,
              class_name: getModifyClassMane(item?.class_name),
              class_id: item?.class_id,
            };
          });
          setClasses(newClassObject || []);
          // setCourses(response.data);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
    getData(`${'new_student_academic_history/get/' + StudentId}`)
      .then((data: any) => {
        if (data?.status) {
          if (data?.data?.[0]?.class_id) {
            getData(`/class/get/${data?.data?.[0]?.class_id}`).then(
              (response: any) => {
                if (response.status) {
                  setParticularClass(response.data.class_name);
                } else setParticularClass('');
              },
            );
          }
          data?.data?.forEach((item: any) => {
            const newBox = {
              id: item?.id,
              institute_type: item?.institution_type,
              board: item?.board,
              state_for_stateboard: item?.state_for_stateboard,
              institute_id: item?.institute_id,
              course_id: item?.course_id,
              learning_style: item?.learning_style,
              class_id: item?.class_id,
              year: item?.year ? dayjs(item?.year) : null,
              stream: item?.stream,
              university_id: item?.university_id,
              sem_id: item?.sem_id,
              errors: undefined,
            };

            if (!boxes.some((box) => box.id === newBox.id)) {
              setBoxes((prevBoxes) => [...prevBoxes, newBox]);
              // setCheckBoxes((prevBoxes) => [...prevBoxes, newBox]);
            }
          });
        } else if (data?.code === 404) {
          setBoxes([
            {
              id: 0,
              institute_type: '',
              board: '',
              state_for_stateboard: '',
              institute_id: '',
              course_id: '',
              learning_style: '',
              class_id: '',
              year: null,
              stream: '',
              university_id: '',
              sem_id: '',
              errors: undefined,
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
          position: 'top-center',
        });
      });
    listData();
  }, [updateBoxes]);
  const [errors, setErrors] = useState(initialErrors);

  const saveAcademy = (instituteId: number = 0) => {
    let hasErrors = false;
    let updatedErrors: any = { ...initialErrors };

    // Validate each box and check for errors
    const updatedBoxes = boxes.map((box) => {
      const errors = validateFields(box);
      updatedErrors = { ...updatedErrors, ...errors };

      // If any field has errors, set hasErrors to true
      if (Object.values(errors).some((error) => error)) {
        hasErrors = true;
      }

      return { ...box, errors }; // Attach errors to each box
    });

    setErrors(updatedErrors); // Update the error state

    if (hasErrors) {
      // toast.error("Please fill all required fields correctly.", {
      //   hideProgressBar: true,
      //   theme: "colored",
      //   position: "top-center",
      // });
      return; // Prevent proceeding if validation fails
    }

    // If validation passes, proceed with form submission
    const promises = updatedBoxes.map((box) => {
      const formData = new FormData();

      // Common fields
      formData.append('student_id', StudentId || '');
      formData.append('institution_type', box.institute_type);
      formData.append('year', box?.year?.$y && box.institute_type.toLowerCase() === 'college' ? String(box.year.$y) : '');
      
      // School-specific fields
      if (box.institute_type.toLowerCase() === 'school') {
          formData.append('board', box.board);
          formData.append('class_id', String(box.class_id));
          formData.append('state_for_stateboard', box.state_for_stateboard !== null ? String(box.state_for_stateboard) : '');
          if (['class_11', 'class_12'].includes(particularClass)) {
              formData.append('stream', box?.stream || '');
          }
      }
      
      // College-specific fields
      if (box.institute_type.toLowerCase() === 'college') {
          formData.append('institute_id', String(instituteId || box.institute_id));
          formData.append('course_id', String(box.course_id));
          formData.append('learning_style', box.learning_style);
          if (box.sem_id) formData.append('sem_id', String(box.sem_id));
          if (box.university_id) formData.append('university_id', String(box.university_id));
      }
      

      // Submit the form data (handle POST/PUT request here)

      if (editFlag && box.id === 0) {
        return postData('/new_student_academic_history/add', formData);
      } else {
        return putData(`/new_student_academic_history/edit/${box.id}`, formData);
      }
    });

    // Handle all promises
    Promise.all(promises)
      .then((responses) => {
        const allSuccessful = responses.every(
          (response) => response?.status ,
        );
        if (allSuccessful) {
          if (editAcademicHistory) {
            if (editFlag) {
              toast.success('Academic history saved successfully', {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
              setEditAcademicHistory(false);
              setUpdateBoxes(true);
              setEditFlag(false);
              setBoxes([]);
              //setActiveForm((prev) => prev + 1);
            } else {
              toast.success('Academic history updated successfully', {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
              setEditAcademicHistory(false);
              setUpdateBoxes(true);
              setEditFlag(false);
            }
          }
          setActiveForm((prev) => prev + 1);
        } else {
          toast.error('An error occurred while saving', {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('An error occurred while saving', {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
  };

  const handleInputChange = (
    index: number,
    field: keyof Box,
    value: string | dayjs.Dayjs | null | number,
  ) => {
    setEditAcademicHistory(true);
    const newBoxes = [...boxes];
    newBoxes[index] = { ...newBoxes[index], [field]: value };
    if (field === 'university_id') {
      
      const filterDataInstitute = institutesAll.filter(
        (item) => (item.university_id === value && item.is_active===1 && item.is_approve==true),
      );
      console.log(filterDataInstitute,'filtered institute 552')
      setInstitutes(filterDataInstitute);
    }
    if (field === 'institute_id') {
      const filterDataCourse = coursesAll.filter(
        (item) => item.institution_id === value,
      );
      setCourses(filterDataCourse);
    }

    if (field === 'course_id') {
      const semesterCount = semester.filter((item) => item.course_id === value);

      // const semesterCount = semester.reduce((acc: any, crr) => {
      //   if (crr.semester_number === value) acc = crr.semester_number
      //   return acc
      // }, 0)
      setTotalSemester(semesterCount);
    }
    // Check date validity
    const year = dayjs(newBoxes[index].year);

    // const endDate = dayjs(newBoxes[index].ending_date);

    const newEnddateInvalidList = [...enddateInvalidList];

    if (
      year.isValid()
      //   endDate.isValid() &&
      //   endDate.isBefore(startDate)
    ) {
      newEnddateInvalidList[index] = true;
    } else {
      newEnddateInvalidList[index] = false;
    }

    setBoxes(newBoxes);
    setEnddateInvalidList(newEnddateInvalidList);
    if (field === 'class_id') {
      getData(`/class/get/${value}`).then((response: any) => {
        if (response.status) {
          setParticularClass(response.data.class_name);
        } else setParticularClass('');
      });
    }
  };
  const handleInputChange1 = (
    index: number,
    field: keyof Boxset,
    value: any,
  ) => {
    setEditAcademicHistory(true);
    // setenddateInvalid(value)
    const newBoxes: any = [...boxes1];
    newBoxes[index][field] = value;
    setBoxes1(newBoxes);
  };
  useEffect(() => {
    const semesterCount = semester?.filter(
      (items) => items.course_id === boxes[0]?.course_id,
    );
    setTotalSemester(semesterCount);
  }, [boxes[0]?.course_id, activeForm]);
  useEffect(() => {
    if (boxes[0]?.institute_type === 'college') {
      const filterDataInstitute = institutesAll.filter(
        (item) => item.university_id === boxes[0].university_id  && item.is_active===1 && item.is_approve==true,
      );
      setInstitutes(filterDataInstitute);
      const filterDataCourse = coursesAll.filter(
        (item) => item.institution_id === boxes[0].institute_id,
      );
      setCourses(filterDataCourse);
      // const semesterCount = semester.filter((item) => item.course_id === boxes[0].course_id)
      // setTotalSemester(semesterCount)
    }
  }, [boxes, activeForm]);

  //  const maxSemester = totalSemester && totalSemester?.length > 0
  //     ? Math.max(...totalSemester?.map((item: { semester_number: any; }) => item?.semester_number))
  //     : 0;

  // useEffect(() => {
  //   if (totalSemester && totalSemester?.length > 0) {
  //     const max = Math.max(
  //       ...totalSemester.map(
  //         (item: { semester_number: any }) => item?.semester_number
  //       )
  //     );
  //     setMaxSemester(max);
  //   } else {
  //     setMaxSemester(0);
  //   }
  // }, [totalSemester]);
  console.log(institutes);
  return (
    <div className="mt-5">
      <form>
        {boxes?.map((box, index) => (
          <div
            className="row align-items-center"
            key={box.id}
            style={{ marginBottom: '5px' }}
          >
            <div className="col form_field_wrapper">
              <FormControl
                required
                sx={{ m: 1, minWidth: 70, width: '100%', maxWidth: 200 }}
              >
                <InputLabel>Institute Type</InputLabel>
                <Select
                  value={box.institute_type}
                  sx={{
                    backgroundColor: '#f5f5f5',
                    '& .MuiSelect-icon': {
                      color: fieldIcon(namecolor),
                    },
                  }}
                  onChange={(e) =>
                    handleInputChange(index, 'institute_type', e.target.value)
                  }
                  label="Institute Type"
                >
                  {menuItems?.map((item) => (
                    <MenuItem
                      key={item.value}
                      value={item.value}
                      sx={commonStyle(namecolor)}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
                {/* {box.errors?.institute_type && (
                <FormHelperText error>{box.errors.institute_type}</FormHelperText>
              )} */}
                {errors.institute_type && !box?.institute_type && (
                  <FormHelperText error>{errors.institute_type}</FormHelperText>
                )}
              </FormControl>
            </div>
            {box.institute_type == 'school' && (
              <div className="col form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 70, width: '100%', maxWidth: 200 }}
                >
                  <InputLabel>Board</InputLabel>
                  <Select
                    value={box.board}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      '& .MuiSelect-icon': {
                        color: fieldIcon(namecolor),
                      },
                    }}
                    onChange={(e) =>
                      handleInputChange(index, 'board', e.target.value)
                    }
                    label="Board"
                  >
                    {boardItems?.map((item) => (
                      <MenuItem
                        key={item.value}
                        value={item.value}
                        sx={commonStyle(namecolor)}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.board && !box?.board && (
                    <FormHelperText error>{errors.board}</FormHelperText>
                  )}
                </FormControl>
              </div>
            )}
            {box.board == 'state_board' && box.institute_type !== 'college' && (
              <div className="col form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 70, width: '100%', maxWidth: 200 }}
                >
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state_for_stateboard"
                    value={box?.state_for_stateboard?.toLowerCase()}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      '& .MuiSelect-icon': {
                        color: fieldIcon(namecolor),
                      },
                    }}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        'state_for_stateboard',
                        e.target.value,
                      )
                    }
                    label="State"
                  >
                    {stateOptions.map((state: any) => (
                      <MenuItem
                        key={state.value}
                        value={state.label.toLowerCase()}
                        sx={commonStyle(namecolor)}
                      >
                        {state.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.state_for_stateboard &&
                    !box?.state_for_stateboard?.toLowerCase() && (
                      <FormHelperText error>
                        {errors.state_for_stateboard}
                      </FormHelperText>
                    )}
                </FormControl>
              </div>
            )}

            {box.institute_type == 'college' && (
              <div className="col form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 220, width: '100%' }}
                >
                  <InputLabel>University name</InputLabel>
                  <Select
                    value={box.university_id}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      '& .MuiSelect-icon': {
                        color: fieldIcon(namecolor),
                      },
                    }}
                    onChange={(e) =>
                      handleInputChange(index, 'university_id', e.target.value)
                    }
                    label="University Name"
                  >
                    {university.map((item) => (
                      <MenuItem
                        key={item?.university_id}
                        value={item?.university_id}
                        sx={commonStyle(namecolor)}
                      >
                        {item.university_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.university_id && !box?.university_id && (
                    <FormHelperText error>
                      {errors.university_id}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
            )}

            {box.institute_type == 'college' && (
              <div className="col form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 220, width: '100%' }}
                >
                  <InputLabel>Institute Name</InputLabel>
                  <Select
                    name="institute_id"
                    value={box.institute_id}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      '& .MuiSelect-icon': {
                        color: fieldIcon(namecolor),
                      },
                    }}
                    onChange={(e) =>
                      handleInputChange(index, 'institute_id', e.target.value)
                    }
                    label="Institute Name"
                  >
                    {institutes.map((institute) => (
                      <MenuItem
                        key={institute.id}
                        value={institute.id}
                        sx={commonStyle(namecolor)}
                      >
                        {institute.institution_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.institute_id && !box?.institute_id && (
                    <FormHelperText error>{errors.institute_id}</FormHelperText>
                  )}
                </FormControl>
              </div>
            )}
            {box.institute_type == 'college' && (
              <div className="col form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 220, width: '100%' }}
                >
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={box.course_id}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      '& .MuiSelect-icon': {
                        color: fieldIcon(namecolor),
                      },
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
                        sx={commonStyle(namecolor)}
                      >
                        {course.course_name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.course_id && !box?.course_id && (
                    <FormHelperText error>{errors.course_id}</FormHelperText>
                  )}
                </FormControl>
              </div>
            )}
            {box.institute_type == 'college' && (
              <div className="col-lg-3 form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 220, width: '100%' }}
                >
                  <InputLabel>Semester</InputLabel>
                  <Select
                    value={box.sem_id}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      '& .MuiSelect-icon': {
                        color: fieldIcon(namecolor),
                      },
                    }}
                    onChange={(e) =>
                      handleInputChange(index, 'sem_id', e.target.value)
                    }
                    label="Semester"
                  >
                    {/* {[...Array(maxSemester)]?.map((_, index) => (
                      <MenuItem
                        key={`${index + 1}`}
                        value={index + 1}
                        sx={{
                          backgroundColor: inputfield(namecolor),
                          color: inputfieldtext(namecolor),
                          '&:hover': {
                            backgroundColor: inputfieldhover(namecolor),
                          },
                        }}
                      >
                        Semester {index + 1}
                      </MenuItem>
                    ))} */}
                    {totalSemester
                      ?.sort(
                        (a: any, b: any) =>
                          a.semester_number - b.semester_number,
                      )
                      .map((item: any) => (
                        <MenuItem
                          key={item?.semester_id}
                          value={item?.semester_id}
                          sx={commonStyle(namecolor)}
                        >
                          Semester {item.semester_number}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.sem_id && !box?.sem_id && (
                    <FormHelperText error>{errors.sem_id}</FormHelperText>
                  )}
                </FormControl>
              </div>
            )}
            {box.institute_type == 'school' && (
              <div className="col form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 220, width: '100%' }}
                >
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={box.class_id}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      '& .MuiSelect-icon': {
                        color: fieldIcon(namecolor),
                      },
                    }}
                    onChange={(e) =>
                      handleInputChange(index, 'class_id', e.target.value)
                    }
                    label="Class"
                  >
                    {// classes.map((classes) => (
                      classes
                        ?.sort((a, b) => a.class_name.localeCompare(b.class_name)) // Sort the classes array in ascending order by class_name
                        ?.map((classes) => (
                          <MenuItem
                            key={classes.id}
                            value={classes.id}
                            sx={commonStyle(namecolor)}
                          >
                            {classes.class_name}
                          </MenuItem>
                        ))}
                  </Select>
                  {errors.class_id && !box?.class_id && (
                    <FormHelperText error>{errors.class_id}</FormHelperText>
                  )}
                </FormControl>
              </div>
            )}
            {box.institute_type == 'school' &&
              (particularClass === 'class_11' ||
                particularClass === 'class_12') && (
                <div className="col-lg-3 form_field_wrapper">
                  <FormControl
                    required
                    sx={{ m: 1, minWidth: 70, width: '100%', maxWidth: 200 }}
                  >
                    <InputLabel>Stream</InputLabel>
                    <Select
                      value={box.stream}
                      sx={{
                        backgroundColor: '#f5f5f5',
                        '& .MuiSelect-icon': {
                          color: fieldIcon(namecolor),
                        },
                      }}
                      onChange={(e) =>
                        handleInputChange(index, 'stream', e.target.value)
                      }
                      label="Stream"
                    >
                      {stremItems?.map((item) => (
                        <MenuItem
                          key={item.value}
                          value={item.value}
                          sx={commonStyle(namecolor)} // Apply the commonStyle function
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.stream && !box?.stream && (
                      <FormHelperText error>{errors.stream}</FormHelperText>
                    )}
                  </FormControl>
                </div>
              )}
            {box.institute_id == '1' && (
              <div className="col form_field_wrapper">
                <FormControl sx={{ m: 1, minWidth: 180, width: '100%' }}>
                  {boxes1.map((box, index) => (
                    <TextField
                      key={box.id}
                      name="Institute_Name_Add"
                      sx={{
                        backgroundColor: '#f5f5f5',
                      }}
                      value={box.Institute_Name_Add}
                      onChange={(e) =>
                        handleInputChange1(
                          index,
                          'Institute_Name_Add',
                          e.target.value,
                        )
                      }
                      label="Institute Name"
                    />
                  ))}
                </FormControl>
              </div>
            )}
            {box.institute_type === 'college' && (
              <div className="col-lg-3 form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 70, width: '100%', maxWidth: 200 }}
                >
                  <InputLabel>Learning Style</InputLabel>
                  <Select
                    value={box.learning_style}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      '& .MuiSelect-icon': {
                        color: fieldIcon(namecolor),
                      },
                    }}
                    onChange={(e) =>
                      handleInputChange(index, 'learning_style', e.target.value)
                    }
                    label="Learning Style"
                  >
                    {learningItems?.map((item) => (
                      <MenuItem
                        key={item.value}
                        value={item.value}
                        sx={commonStyle(namecolor)}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.learning_style && !box?.learning_style && (
                    <FormHelperText error>
                      {errors.learning_style}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
            )}
            {box.institute_type === 'college' && (
              <div
                className={`${box.institute_id == '1' ? 'col-lg-3' : 'col-lg-3 col-md-6'
                  } form_field_wrapper`}
              >
                <FormControl
                  required
                  sx={{
                    m: 1,
                    minWidth: 180,
                    // width: "100%",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={['year']}
                      format="YYYY"
                      label="Year *"
                      disableFuture
                      sx={{
                        backgroundColor: '#f5f5f5',
                      }}
                      value={dayjs(box.year)}
                      onChange={(date) =>
                        handleInputChange(index, 'year', date)
                      }
                    />
                  </LocalizationProvider>
                  {errors?.year && errors.year !== '' && (
                    <FormHelperText error>{errors.year}</FormHelperText>
                  )}
                </FormControl>
              </div>
            )}
          </div>
        ))}

        <div className="mt-3 d-flex align-items-center justify-content-between">
          <button
            type="button"
            className="btn btn-outline-dark prev-btn px-lg-4 rounded-pill"
            onClick={() => setActiveForm((prev) => prev - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-dark px-lg-5 ms-auto d-block rounded-pill next-btn"
            onClick={() => saveAcademy(0)}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default AcademicHistory;
