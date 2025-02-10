/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import '../Uploadpdf/Uploadpdf.scss';
import useApi from '../../hooks/useAPI';
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  //TextField,
  Typography,
} from '@mui/material';
import { QUERY_KEYS_SUBJECT } from '../../utils/const';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NameContext from '../Context/NameContext';
import { State } from 'country-state-city';
import { commonStyle } from '../../utils/helpers';
import RefreshIcon from '@mui/icons-material/Refresh';
import UploadBtn from '../../Components/UploadBTN/UploadBtn';

interface Classes {
  id: number;
  class_name: string;
  new_class_name: string;
  class_id: string;
}
interface Box {
  id: number;
  institute_type: string;
  board: string;
  state_for_stateboard: string;
  institute_id: string;
  course_id: string;
  learning_style: string;
  class_id: string;
  year: any;
  stream: string;
  university_id?: string;
  // sem_id: string;
  sem_id?: string;
  subject_id?: string;
}
interface Institute {
  // id: number;
  institute_id: string;
  institution_name: string;
  university_id: any;
  id: string | number;
}
interface Course {
  // id: number;
  id: string | number;
  course_name: string;
  course_id: string;
  institution_id: string;
}
interface Semester {
  id: number;
  semester_number: string;
  sem_id: string;
  course_id: string;
}
interface University {
  id: number;
  university_name: string;
  university_id: string;
}
interface Option {
  value: string;
  label: string;
}
interface Subject {
  id: string;
  subject_name: string;
  subject_id: string;
}

const Uploadpdf = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const navigator = useNavigate();
  const SubjectURL = QUERY_KEYS_SUBJECT.GET_SUBJECT;
  let AdminId: string | null = localStorage.getItem('_id');
  if (AdminId) {
    AdminId = String(AdminId);
  }
  const initials = {
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
  };
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([initials]);
  const [institutesAll, setInstitutesAll] = useState<Institute[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [coursesAll, setCoursesAll] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semester, setSemester] = useState<Semester[]>([]);
  const [totalSemester, setTotalSemester] = useState<any>([]);
  const [particularClass, setParticularClass] = useState('');
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [university, setUniversity] = useState<University[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsAll, setSubjectsAll] = useState<Subject[]>([]);
  const [uploadTasks, setUploadTasks] = useState<any[]>([]);

  const menuItemsInstitute = [
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
  const { getData, loading, postFileData } = useApi();
  useEffect(() => {
    const states = State.getStatesOfCountry('IN');
    const stateOptions = states.map((state) => ({
      value: state.name,
      label: state.name,
    }));
    setStateOptions(stateOptions);
  }, [State]);

  const callAPI = async () => {
    getData(`${SubjectURL}`)
      .then((data: any) => {
        if (data.data) {
          // setDataSubject(data?.data);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
  useEffect(() => {
    callAPI();

    getData('/class/list')
      .then((response: any) => {
        if (response.status) {
          const filteredData: any[] = [];
          response?.data?.forEach((item: any) => {
            if (item?.is_active) {
              const updatedClassName = item.class_name.split('_').join(' ');
              item.new_class_name =
                updatedClassName.charAt(0).toUpperCase() +
                updatedClassName.slice(1);
              filteredData.push(item);
            }
          });

          setClasses(filteredData || []);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  }, []);
  const listData = async () => {
    return new Promise((resolve) => {
      getData('/institution/list')
        .then(async (response: any) => {
          if (response.status) {
            const filteredData = await response?.data?.filter(
              (item: any) => item?.is_active === 1,
            );
            setInstitutes(filteredData || []);
            setInstitutesAll(filteredData || []);
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
  const getSubject = async () => {
    if (boxes[0]?.institute_type?.toLowerCase() === 'school') {
      getData('school_subject/list')
        .then((response: any) => {
          if (response.status) {
            const filteredData = response?.data?.filter(
              (item: any) => item?.is_active === 1,
            );
            setSubjects(filteredData || []);
            setSubjectsAll(filteredData || []);
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        });
    } else {
      getData('college_subject/list')
        .then((response: any) => {
          if (response.status) {
            const filteredData = response?.data?.filter(
              (item: any) => item?.is_active === 1,
            );
            setSubjects(filteredData || []);
            setSubjectsAll(filteredData || []);
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        });
    }
  };

  useEffect(() => {
    listData();
    getData('university/list')
      .then((response: any) => {
        if (response.status) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === 1,
          );
          setUniversity(filteredData || []);
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
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
  }, []);
  useEffect(() => {
    getSubject();
  }, [boxes[0]?.institute_type]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const pdfFiles = filesArray.filter(
        (file) => file.type === 'application/pdf',
      );

      if (pdfFiles.length !== filesArray.length) {
        toast.error('Only PDF files are allowed');
      }
      setSelectedFiles(pdfFiles);
    }
  };

  const refreshTaskStatus = async (task_id: string) => {
    try {
      const response = await getData(
        `https://dbllm.gyansetu.ai/task-result/${task_id}`,
      );
      if (response?.combined_task_id) {
        setUploadTasks((prev) =>
          prev.map((task) =>
            task.task_id === response.combined_task_id
              ? { ...task, status: response.overall_status }
              : task,
          ),
        );
        if (response.overall_status === 'IN-PROGRESS') {
          toast.info('Upload still in progress', {
            hideProgressBar: true,
            theme: 'colored',
          });
        } else if (response.overall_status === 'COMPLETED') {
          toast.success('Upload completed successfully', {
            hideProgressBar: true,
            theme: 'colored',
          });
        }
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to refresh status', {
        hideProgressBar: true,
        theme: 'colored',
      });
    }
  };
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('No files selected');
      return;
    }
    if (boxes[0]?.institute_type?.toLowerCase() === 'college') {
      const { institute_id, university_id, course_id, sem_id } = boxes[0];
      // Check if any of the fields are empty
      if (!institute_id || !university_id || !course_id || !sem_id) {
        toast.error('Required fields are missing');
        return;
      }
    }
    if (boxes[0]?.institute_type?.toLowerCase() === 'school') {
      const { board, class_id, state_for_stateboard, stream } = boxes[0];

      // Check if any of the fields are empty
      if (!board || !class_id) {
        toast.error('Required fields are missing');
        return;
      }
      // Additional check if the board is "state_board" and `state_for_stateboard` is required
      if (board.toLowerCase() === 'state_board' && !state_for_stateboard) {
        toast.error('State for State Board is required');
        return;
      }

      // Additional check if the class is "class_11" or "class_12" and `stream` is required
      if (
        (particularClass === 'class_11' || particularClass === 'class_12') &&
        !stream
      ) {
        toast.error('Stream is required for Class 11 and Class 12');
        return;
      }
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('pdf_file', file);
    });
    if (AdminId !== null) {
      formData.append('teacher_id', String(AdminId));
      if (boxes[0]?.institute_type?.toLowerCase() === 'college') {
        const {
          institute_id,
          university_id,
          course_id,
          sem_id,
          institute_type,
          subject_id,
        } = boxes[0];
        const universityNames = await university
          ?.filter((item) => item.university_id === university_id)
          ?.map((item) => item.university_name);
        const filterInstitute = await institutesAll
          ?.filter(
            (item) =>
              item.university_id === university_id && item?.id === institute_id,
          )
          ?.map((item) => item.institution_name);
        const filterCourse = await coursesAll
          .filter(
            (item) =>
              item.institution_id === institute_id && item?.id === course_id,
          )
          ?.map((item) => item.course_name);
        const filterSubject = await subjectsAll
          ?.filter(
            (item: any) =>
              item?.institution_id === institute_id &&
              item?.course_id === course_id &&
              item?.semester_id === sem_id &&
              item?.subject_id === subject_id,
          )
          ?.map((item) => item.subject_name);

        if (universityNames && universityNames.length > 0) {
          formData.append('university_selection', universityNames.join(','));
        }
        if (filterInstitute && filterInstitute.length > 0) {
          formData.append('college_selection', filterInstitute.join(','));
        }
        if (filterCourse && filterCourse.length > 0) {
          formData.append('course_selection', filterCourse.join(','));
        }
        if (filterSubject && filterSubject.length > 0) {
          formData.append('subject', filterSubject.join(','));
        }
        if (institute_type)
          formData.append('school_college_selection', institute_type);
        const semnumber = totalSemester?.filter(
          (item: any) => item?.semester_id === sem_id,
        );
        const semIdNumber = Number(semnumber[0]?.semester_number);

        let year = null;
        if (semIdNumber === 1 || semIdNumber === 2) {
          year = '1st';
        } else if (semIdNumber === 3 || semIdNumber === 4) {
          year = '2nd';
        } else if (semIdNumber === 5 || semIdNumber === 6) {
          year = '3rd';
        } else if (semIdNumber === 7 || semIdNumber === 8) {
          year = '4th';
        }
        if (year) formData.append('year', year);
      }
      if (boxes[0]?.institute_type?.toLowerCase() === 'school') {
        const {
          board,
          class_id,
          state_for_stateboard,
          stream,
          institute_type,
        } = boxes[0];
        if (institute_type)
          formData.append('school_college_selection', institute_type);

        if (board) formData.append('board_selection', board?.toUpperCase());
        if (class_id)
          formData.append('class_selection', particularClass || class_id);
        if (state_for_stateboard)
          formData.append('state_board_selection', state_for_stateboard);
        if (stream) formData.append('stream_selection', stream);
      }
    }
    await postFileData(
      `${'https://dbllm.gyansetu.ai/upload-pdf-hierarchy'}`,
      formData,
    )
      .then((data: any) => {
        if (data?.status_code === 200) {
          toast.success('PDF Upload Queued Successfully', {
            hideProgressBar: true,
            theme: 'colored',
          });
          const newTask = {
            task_id: data.combined_task_id,
            status: data.status,
            created_at: new Date().toLocaleString(),
          };
          setUploadTasks((prev) => [...prev, newTask]);
          setSelectedFiles([]);
          setBoxes([initials]);
        } else {
          toast.error(data?.message, {
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
  };
  const usertype: any = localStorage.getItem('user_type');

  if (usertype !== 'admin') {
    navigator('/main/*');
  }
  const midpoint = Math.ceil(selectedFiles.length / 2);
  const firstBatch = selectedFiles.slice(0, midpoint);
  const secondBatch = selectedFiles.slice(midpoint);
  const handleInputChange = (
    index: number,
    field: keyof Box,
    value: string | null,
  ) => {
    const newBoxes = [...boxes];
    newBoxes[index] = { ...newBoxes[index], [field]: value };
    if (field === 'institute_type') {
      if (value?.toLowerCase() === 'school') {
        newBoxes[index].institute_id = '';
        newBoxes[index].university_id = '';
        newBoxes[index].course_id = '';
        newBoxes[index].sem_id = '';
        newBoxes[index].subject_id = '';
      } else {
        newBoxes[index].board = '';
        newBoxes[index].state_for_stateboard = '';
        newBoxes[index].class_id = '';
        newBoxes[index].stream = '';
        newBoxes[index].subject_id = '';
      }
    }
    if (field === 'board') {
      newBoxes[index].state_for_stateboard = '';
    }
    if (field === 'university_id') {
      newBoxes[index].institute_id = '';
      newBoxes[index].course_id = '';
      newBoxes[index].sem_id = '';
      newBoxes[index].subject_id = '';
      const filterDataInstitute = institutesAll.filter(
        (item) => item.university_id === value,
      );
      setInstitutes(filterDataInstitute);
    }
    if (field === 'institute_id') {
      newBoxes[index].course_id = '';
      newBoxes[index].sem_id = '';
      newBoxes[index].subject_id = '';
      const filterDataCourse = coursesAll.filter(
        (item) => item.institution_id === value,
      );
      setCourses(filterDataCourse);
    }

    if (field === 'course_id') {
      newBoxes[index].sem_id = '';
      newBoxes[index].subject_id = '';
      const semesterCount = semester.filter((item) => item.course_id === value);
      setTotalSemester(semesterCount);
    }
    if (field === 'sem_id') {
      newBoxes[index].subject_id = '';
      const filterData = subjectsAll?.filter(
        (item: any) =>
          item?.institution_id === boxes[0]?.institute_id &&
          item?.course_id === boxes[0]?.course_id &&
          item?.semester_id === value,
      );
      setSubjects(filterData);
    }
    if (field === 'class_id') {
      newBoxes[index].subject_id = '';
      const filterData = subjectsAll?.filter(
        (item: any) => item?.class_id === value,
      );
      setSubjects(filterData);
    }
    if (field === 'stream') {
      if (boxes[0]?.stream !== '' || boxes[0]?.stream !== undefined) {
        const filterData = subjectsAll?.filter(
          (item: any) =>
            item?.class_id === boxes[0]?.class_id && item?.stream === value,
        );
        setSubjects(filterData);
      }
    }
    setBoxes(newBoxes);
    if (field === 'class_id') {
      getData(`/class/get/${value}`).then((response: any) => {
        if (response.status) {
          setParticularClass(response.data.class_name);
        } else setParticularClass('');
      });
    }
  };
  return (
    <>
      {loading && <FullScreenLoader />}
      <div className="main-wrapper">
        <div className="main-content">
          <div className="card">
            <div className="card-body">
              <div className="table_wrapper">
                <div className="table_inner">
                  <div
                    className="containerbutton"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h6" sx={{ m: 1 }}>
                      {/* <div className='main_title'>Teacher</div> */}
                    </Typography>
                  </div>
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
                              sx={{
                                m: 1,
                                minWidth: 70,
                                width: '100%',
                                maxWidth: 200,
                              }}
                            >
                              <InputLabel>Institute Type</InputLabel>
                              <Select
                                value={box.institute_type}
                                sx={{
                                  backgroundColor: '#f5f5f5',
                                }}
                                onChange={(e) =>
                                  handleInputChange(
                                    index,
                                    'institute_type',
                                    e.target.value,
                                  )
                                }
                                label="Institute Type"
                              >
                                {menuItemsInstitute?.map((item) => (
                                  <MenuItem
                                    key={item.value}
                                    value={item.value}
                                    sx={commonStyle(namecolor)}
                                  >
                                    {item.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </div>
                          {box.institute_type == 'school' && (
                            <div className="col form_field_wrapper">
                              <FormControl
                                required
                                sx={{
                                  m: 1,
                                  minWidth: 70,
                                  width: '100%',
                                  maxWidth: 200,
                                }}
                              >
                                <InputLabel>Board</InputLabel>
                                <Select
                                  value={box.board}
                                  sx={{
                                    backgroundColor: '#f5f5f5',
                                  }}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      'board',
                                      e.target.value,
                                    )
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
                              </FormControl>
                            </div>
                          )}
                          {box.board == 'state_board' &&
                            box.institute_type !== 'college' && (
                              <div className="col form_field_wrapper">
                                <FormControl
                                  required
                                  sx={{
                                    m: 1,
                                    minWidth: 70,
                                    width: '100%',
                                    maxWidth: 200,
                                  }}
                                >
                                  <InputLabel>State</InputLabel>
                                  <Select
                                    name="state_for_stateboard"
                                    value={box.state_for_stateboard.toLowerCase()}
                                    sx={{
                                      backgroundColor: '#f5f5f5',
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
                                  }}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      'university_id',
                                      e.target.value,
                                    )
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
                                  }}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      'institute_id',
                                      e.target.value,
                                    )
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
                                  }}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      'course_id',
                                      e.target.value,
                                    )
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
                                  }}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      'sem_id',
                                      e.target.value,
                                    )
                                  }
                                  label="Semester"
                                >
                                  {totalSemester
                                    ?.sort(
                                      (a: any, b: any) =>
                                        a?.semester_number - b?.semester_number,
                                    )
                                    ?.map((item: any) => (
                                      <MenuItem
                                        key={item?.semester_id}
                                        value={item?.semester_id}
                                        sx={commonStyle(namecolor)}
                                      >
                                        Semester {item.semester_number}
                                      </MenuItem>
                                    ))}
                                </Select>
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
                                  }}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      'class_id',
                                      e.target.value,
                                    )
                                  }
                                  label="Class"
                                >
                                  {classes
                                    .sort((a, b) =>
                                      a.class_name.localeCompare(b.class_name),
                                    ) // Sorts by class_name in ascending order
                                    .map((classes) => (
                                      <MenuItem
                                        key={classes.id}
                                        value={classes.id}
                                        sx={commonStyle(namecolor)}
                                      >
                                        {classes.class_name}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                            </div>
                          )}
                          {box.institute_type == 'school' &&
                            (particularClass === 'class_11' ||
                              particularClass === 'class_12') && (
                              <div className="col-lg-3 form_field_wrapper">
                                <FormControl
                                  required
                                  sx={{
                                    m: 1,
                                    minWidth: 70,
                                    width: '100%',
                                    maxWidth: 200,
                                  }}
                                >
                                  <InputLabel>Stream</InputLabel>
                                  <Select
                                    value={box.stream}
                                    sx={{
                                      backgroundColor: '#f5f5f5',
                                    }}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        'stream',
                                        e.target.value,
                                      )
                                    }
                                    label="Stream"
                                  >
                                    {stremItems?.map((item) => (
                                      <MenuItem
                                        key={item.value}
                                        value={item.value}
                                        sx={commonStyle(namecolor)}
                                      >
                                        {item.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </div>
                            )}
                          {box.institute_type && (
                            <div className="col form_field_wrapper">
                              <FormControl
                                required
                                sx={{ m: 1, minWidth: 220, width: '100%' }}
                              >
                                <InputLabel>Subject</InputLabel>
                                <Select
                                  name="subject_id"
                                  value={box.subject_id}
                                  sx={{
                                    backgroundColor: '#f5f5f5',
                                  }}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      'subject_id',
                                      e.target.value,
                                    )
                                  }
                                  label="Subject"
                                >
                                  {subjects.map((subject) => (
                                    <MenuItem
                                      key={subject.subject_id}
                                      value={subject.subject_id}
                                      sx={commonStyle(namecolor)}
                                    >
                                      {subject.subject_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </div>
                          )}
                        </div>
                      ))}
                    </form>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '20px',
                      marginBottom: '20px',
                    }}
                  >
                    <UploadBtn
                      label="Upload PDFs"
                      name="pdfDocuments"
                      accept=".pdf"
                      handleFileChange={handleFileChange}
                    />
                  </div>
                  {uploadTasks.length > 0 && (
                    <TableContainer
                      component={Paper}
                      sx={{
                        marginTop: 3,
                        '& .MuiTableCell-root': {
                          px: { xs: 1, sm: 2 },
                          py: { xs: 1, sm: 2 },
                          fontSize: { xs: '0.8rem', sm: '1rem' },
                        },
                      }}
                    >
                      <Table sx={{ minWidth: { xs: '100%', sm: 650 } }}>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{ minWidth: 200, fontWeight: 'bold' }}
                            >
                              Task ID
                            </TableCell>
                            <TableCell
                              sx={{
                                minWidth: 120,
                                fontWeight: 'bold',
                                textAlign: 'center',
                              }}
                            >
                              Status
                            </TableCell>
                            <TableCell
                              sx={{
                                minWidth: 150,
                                fontWeight: 'bold',
                                textAlign: 'center',
                              }}
                            >
                              Created At
                            </TableCell>
                            <TableCell
                              sx={{
                                minWidth: 100,
                                fontWeight: 'bold',
                                textAlign: 'center',
                              }}
                            >
                              Actions
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {uploadTasks.map((task) => (
                            <TableRow key={task.task_id}>
                              <TableCell sx={{ wordBreak: 'break-all' }}>
                                {task.task_id}
                              </TableCell>
                              <TableCell sx={{ textAlign: 'center' }}>
                                <Chip
                                  label={task.status}
                                  color={
                                    task.status === 'COMPLETED'
                                      ? 'success'
                                      : 'warning'
                                  }
                                  variant="outlined"
                                  sx={{ maxWidth: '100%' }}
                                />{' '}
                              </TableCell>
                              <TableCell sx={{ textAlign: 'center' }}>
                                {task.created_at}{' '}
                              </TableCell>
                              <TableCell sx={{ textAlign: 'center' }}>
                                <IconButton
                                  onClick={() =>
                                    refreshTaskStatus(task.task_id)
                                  }
                                  color="primary"
                                  size="small"
                                  disabled={task.status === 'COMPLETED'}
                                  sx={{ '&.Mui-disabled': { opacity: 0.5 } }}
                                >
                                  <RefreshIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  {selectedFiles.length > 0 && (
                    <div className="file-list-container">
                      <div className="file-columns">
                        <div className="file-column">
                          {firstBatch.map((file, index) => (
                            <div
                              key={index}
                              className="file-item"
                              //  onClick={() => setSelectedPdf(URL.createObjectURL(file))}
                            >
                              {file.name}
                            </div>
                          ))}
                        </div>
                        <div className="file-column">
                          {secondBatch.map((file, index) => (
                            <div
                              key={index}
                              className="file-item"
                              // onClick={() => setSelectedPdf(URL.createObjectURL(file))}
                            >
                              {file.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <Button
                    className={`${
                      selectedFiles.length === 0
                        ? 'disabled-mainbutton'
                        : 'mainbutton'
                    }`}
                    sx={{ marginTop: 5 }}
                    variant="contained"
                    onClick={handleFileUpload}
                    disabled={selectedFiles.length === 0}
                  >
                    Submit
                  </Button>
                </div>
                {/* {selectedPdf && (
                                    <div className='pdfView'>
                                    <button onClick={handleClose} className='closeButton'>
                                      &times; 
                                    </button>
                                    <iframe src={selectedPdf} width="100%" height="800px" />
                                  </div>
                                     )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Uploadpdf;
