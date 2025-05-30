/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useApi from "../../../hooks/useAPI";
import { QUERY_KEYS_CLASS, QUERY_KEYS_COURSE, QUERY_KEYS_QUIZ, QUERY_KEYS_SEMESTER, QUERY_KEYS_SUBJECT, QUERY_KEYS_SUBJECT_SCHOOL, QUERY_KEYS_TEACHER } from "../../../utils/const";
import { toast } from "react-toastify";
import { MaterialReactTable } from "material-react-table";
import { IClass, QUIZ_LIST_COLUMNS } from "../../../Components/Table/columns";
import FullScreenLoader from "../../Loader/FullScreenLoader";

const QuizzesList = () => {
    const { getData } = useApi();
    const institute_id = localStorage.getItem("institute_id");
    // const INSTITUTE_LIST = QUERY_KEYS.GET_INSTITUTES;
    const TEACHER_LIST = QUERY_KEYS_TEACHER.GET_TEACHER;
    const COURSE_LIST = QUERY_KEYS_COURSE.GET_COURSE;
    const CLASS_LIST = QUERY_KEYS_CLASS.GET_CLASS;
    const SEMESTER_LIST = QUERY_KEYS_SEMESTER.GET_SEMESTER;
    const SUBJECT_LIST_SCHOOL = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT;
    const SUBJECT_LIST_COLLEGE = QUERY_KEYS_SUBJECT.GET_SUBJECT;
    const QUIZ_LIST = QUERY_KEYS_QUIZ.GET_ALL;
    const columns = QUIZ_LIST_COLUMNS

    const [selecteTeacher, setSelectedTeacher] = useState<any>({});
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectSemester, setSelectSemester] = useState("");
    const [selectSubject, setSelectSubject] = useState("");
    const [selectClass, setSelectClass] = useState<IClass | null>(null);
    const [loading, setLoading] = useState(false);

    // const [dataOfInstitute, setDataOfInstitute] = useState<any[]>([]);
    const [teacherDataList, setTeacherDataList] = useState<any[]>([]);
    const [quizList, setQuizList] = useState<any[]>([]);
    const [quizListFilter, setQuizListFilter] = useState<any[]>([]);
    const [courseList, setCourseList] = useState<any[]>([]);
    const [classesList, setClassesList] = useState<any[]>([]);
    const [semesterList, setSemesterList] = useState<any[]>([]);
    const [subjectList, setSubjectList] = useState<any[]>([]);
    const [courseListFilter, setCourseListFilter] = useState<any[]>([]);
    const [classesListFilter, setClassesListFilter] = useState<any[]>([]);
    const [semesterListFilter, setSemesterListFilter] = useState<any[]>([]);
    const [subjectListFilter, setSubjectListFilter] = useState<any[]>([]);
    const [entityType, setEntityType] = useState("college");
    const [streamList, setstreamList] = useState<string[]>([]);
    const [selectedStream, setSelectedStream] = useState("");
    const [is_Stream, setIs_Stream] = useState(false);
    useEffect(() => {
        // listOfInstitute();
        listOfTeacher();
        listOfCourses();
        listOfClasses();
        listOfSemester();
        //listOfUniversity();
        listOfQuizzes();
    }, [])


    const listOfQuizzes = () => {
        setLoading(true)
        getData(QUIZ_LIST).then((quiz) => {
            if (quiz?.status) {
                setLoading(false)
                setQuizList(quiz?.data?.filter((quiz: any) => quiz?.institute_id == institute_id));
                setQuizListFilter(quiz?.data?.filter((quiz: any) => quiz?.institute_id == institute_id));
            }
        })
    }
    // const listOfInstitute = () => {
    //     getData(INSTITUTE_LIST).then((institute) => {
    //         if (institute?.status) {
    //             setDataOfInstitute(institute?.data)
    //         }
    //     }).catch((e) => {
    //         toast.error(e.message, {
    //             hideProgressBar: true,
    //             theme: "colored",
    //             position: 'top-center'
    //         })
    //     })
    // }
    const listOfTeacher = () => {
        getData(TEACHER_LIST).then((teacher) => {
            if (teacher?.status) {
                const filteredTeacher = teacher?.data?.filter((teacher: any) => teacher?.institute_id == institute_id)
                setTeacherDataList(filteredTeacher)
            }

        }).catch((e) => {
            toast.error(e.message, {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center"
            })
        })
    }

    const listOfCourses = () => {
        getData(COURSE_LIST).then((teacher) => {
            if (teacher?.status) {
                setCourseList(teacher?.data?.course_data)
            }

        }).catch((e) => [
            toast.error(e.message, {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center"
            })
        ])
    }
    const listOfClasses = () => {
        getData(CLASS_LIST).then((teacher) => {
            if (teacher?.status) {
                setClassesList(teacher?.data?.classes_data);
            }

        }).catch((e) => {
            toast.error(e.message, {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center"
            })
        })
    }
    const listOfSemester = () => {
        getData(SEMESTER_LIST).then((teacher) => {
            if (teacher?.status) {
                setSemesterList(teacher?.data?.semesters_data)
            }
        }).catch((e) => {
            toast.error(e.message, {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center"
            })
        })
    }
    const listOfSubjects = (type: string) => {
        if (type == "school") {
            getData(SUBJECT_LIST_SCHOOL).then((teacher) => {
                if (teacher?.status) {
                    setSubjectList(teacher?.data?.subjects_data)
                }
            }).catch((e) => {
                toast.error(e.message, {
                    hideProgressBar: true,
                    theme: "colored",
                    position: "top-center"
                })
            })
        } else {
            getData(SUBJECT_LIST_COLLEGE).then((teacher) => {
                if (teacher?.status) {
                    setSubjectList(teacher?.data?.subjects_data)
                }
            }).catch((e) => {
                toast.error(e.message, {
                    hideProgressBar: true,
                    theme: "colored",
                    position: "top-center"
                })
            })
        }
    }

    const handleChanges = (event: any) => {
        const { name, value } = event.target;
        if (name == "teacher_id") {
            setSelectSubject('');
            setSelectedStream('');
            setSelectedCourse('')
            setSelectClass(null);
            setSelectSemester('');
            const techerValue = teacherDataList.find((teacher) => teacher.id == value);
            setSelectedTeacher(techerValue);
            if (techerValue?.course_semester_subjects) {
                setEntityType("college")
            } else {
                setEntityType("school")
            }
            if (techerValue?.course_semester_subjects) {
                listOfSubjects("college");
                const courseIds = Object.keys(techerValue?.course_semester_subjects)
                console.log(courseIds)
                const filterCourse = courseList.filter((course) => courseIds.includes(course?.id));
                setCourseListFilter(filterCourse);
            } else {
                listOfSubjects("school");
                const classIds = Object.keys(techerValue?.class_stream_subjects || {});
                const filterClasses = classesList.filter((item) =>
                    classIds.includes(String(item.id))
                );
                console.log(filterClasses, classesList);
                setClassesListFilter(filterClasses)
            }
            const filteredQuizList = quizList.filter((quiz) => quiz?.created_by == techerValue?.user_uuid)
            setQuizListFilter(filteredQuizList);
        }
        if (name == "course_id") {
            setSelectedCourse(value)
            const streamsvale = Object.values(selecteTeacher?.course_semester_subjects);
            const semestersList: string[] = [];
            for (const stream of streamsvale) {
                const keys = Object.keys(stream as object);
                semestersList.push(...keys)
            }
            const filteredSemester = semesterList.filter((semester) => semester?.course_id == value && semestersList.includes(semester?.semester_number));
            setSemesterListFilter(filteredSemester);
            const filteredQuizList = quizList.filter((quiz) => {
                if (!quiz?.course_semester_subjects) {
                    return false;
                }
                const teacherCourses=Object.keys(quiz?.course_semester_subjects);
                return quiz?.created_by == selecteTeacher?.user_uuid && teacherCourses.includes(String(value))
            })
            setQuizListFilter(filteredQuizList);
        }
        if (name == "semester_id") {
            setSelectSemester(value)
            const semestervale = Object.values(selecteTeacher?.course_semester_subjects);
            let subjectsNameList: string[] = [];
            let semesterListTeach: string[] = [];
            for (const semester of semestervale) {
                const values = Object.values(semester as { [key: string]: string | number });
                subjectsNameList = subjectsNameList.concat(values.map(String));
                const semesters = Object.keys(semester as { [key: string]: string | number })
                semesterListTeach = semesterListTeach.concat(semesters?.map(String))
            }
            const filteredSubject = subjectList.filter((subject) => subject?.semester_id == value && subjectsNameList.includes(subject?.subject_name));
            setSubjectListFilter(filteredSubject);
            const courseListForteacher = Object.keys(selecteTeacher?.course_semester_subjects);
            const filteredQuizList = quizList.filter((quiz) =>{
              if(!quiz?.course_semester_subjects){
                  return;
              }
               const semesters=Object.values(quiz?.course_semester_subjects);
               let totalSemester:string[]=[];
              for(const sem of semesters){
                  const listofSem=Object.keys(sem as {[key:string]:string|number})
                   totalSemester=totalSemester.concat(listofSem.map(String))
              }
              return (courseListForteacher.includes(String(selectedCourse))&& totalSemester.includes(String(value)) && quiz?.created_by==selecteTeacher?.user_uuid)
            })
             setQuizListFilter(filteredQuizList);
        }

        if (name == "class_id") {
            setSelectedStream("");
            setSelectSubject('');
            const class_name = classesList.find((item) => item?.id == value)
            setSelectClass(class_name);
            if (class_name.class_name == "class_11" || class_name.class_name == "class_12") {
                setIs_Stream(true);
                const streamsvale = Object.values(selecteTeacher?.class_stream_subjects);
                const streamList: string[] = [];
                for (const stream of streamsvale) {
                    const keys = Object.keys(stream as object);
                    streamList.push(...keys)
                }

                setstreamList(streamList)
            } else {
                setIs_Stream(false);
                const streamsvale = Object.values(selecteTeacher?.class_stream_subjects);
                let subjectsNameList: string[] = [];
                for (const stream of streamsvale) {
                    const values = Object.values(stream as { [key: string]: string | number });
                    subjectsNameList = subjectsNameList.concat(values.map(String));
                }
                const filteredSubject = subjectList.filter((subject) => subject.class_id == value && subjectsNameList.includes(subject?.subject_name));
                setSubjectListFilter(filteredSubject)
            }
            const filteredQuizList = quizList.filter((quiz) => {
                if (!quiz?.class_stream_subjects) {
                    return false; // Explicitly return false
                }
                const classesIds = Object.keys(quiz?.class_stream_subjects);
                return (classesIds.includes(String(value)) && quiz?.created_by == selecteTeacher?.user_uuid)
            })
            setQuizListFilter(filteredQuizList);
        }
        if (name == "subject_id") {
            setSelectSubject(value);
            const selectedSubjectName = subjectList.find((subject) => subject?.subject_id == value)?.subject_name;
            if (entityType == "college") {
                const filteredQuizList = quizList.filter((quiz) => {
                    const semestervale = Object.values(quiz?.course_semester_subjects);
                    if (!quiz?.course_semester_subjects) {
                        return false; // Explicitly return false
                    }
                    let subjectListT: string[] = [];
                    let semesterList: string[] = [];
                    for (const stream of semestervale) {
                        const values = Object.values(stream as { [key: string]: string | number });
                        const valSemester = Object.keys(stream as { [key: string]: string | number });
                        subjectListT = subjectListT.concat(values.map(String));
                        semesterList = semesterList.concat(valSemester.map(String))
                    }
                    const courseIds = Object.keys(quiz?.course_semester_subjects);
                    return (courseIds.includes(String(selectedCourse)) && subjectListT.includes(String(selectedSubjectName)) && semesterList.includes(String(selectSemester)) && quiz?.created_by == selecteTeacher?.user_uuid)
                })
                setQuizListFilter(filteredQuizList);
            } else {
                
                if (selectClass?.class_name == "class_11" || selectClass?.class_name == "class_12") {
                    const filteredQuizList = quizList.filter((quiz) => {
                        const streamsvale = Object.values(quiz?.class_stream_subjects);
                        if (!quiz?.class_stream_subjects) {
                            return false; // Explicitly return false
                        }
                        let subjectListT: string[] = [];
                        let streamList: string[] = [];
                        for (const stream of streamsvale) {
                            const values = Object.values(stream as { [key: string]: string | number });
                            const valueOfStreams = Object.keys(stream as { [key: string]: string | number });
                            subjectListT = subjectListT.concat(values.map(String));
                            streamList = streamList.concat(valueOfStreams.map(String))
                        }
                        //console.log(streamList);
                        const classesIds = Object.keys(quiz?.class_stream_subjects);
                        return (classesIds.includes(String(selectClass?.id)) && subjectListT.includes(String(selectedSubjectName)) && streamList.includes(String(selectedStream)) && quiz?.created_by == selecteTeacher?.user_uuid)
                    })
                    setQuizListFilter(filteredQuizList);
                } else {
                    const filteredQuizList = quizList.filter((quiz) => {
                        const streamsvale = Object.values(quiz?.class_stream_subjects);
                        if (!quiz?.class_stream_subjects) {
                            return false; // Explicitly return false
                        }
                        let subjectListT: string[] = [];
                        for (const stream of streamsvale) {
                            const values = Object.values(stream as { [key: string]: string | number });
                            subjectListT = subjectListT.concat(values.map(String));
                        }
                        //console.log(streamList);
                        const classesIds = Object.keys(quiz?.class_stream_subjects);
                        return (classesIds.includes(String(selectClass?.id)) && subjectListT.includes(String(selectedSubjectName)) && quiz?.created_by == selecteTeacher?.user_uuid)
                    })
                    setQuizListFilter(filteredQuizList);
                }
            }
        }
        if (name == "stream") {
            setSelectedStream(value)
            const streamsvale = Object.values(selecteTeacher?.class_stream_subjects);
            let subjectsNameList: string[] = [];
            for (const stream of streamsvale) {
                const values = Object.values(stream as { [key: string]: string | number });
                subjectsNameList = subjectsNameList.concat(values.map(String));
            }
            const filteredSubject = subjectList.filter((subject) => subject.class_id == selectClass?.id && subject?.stream == value && subjectsNameList.includes(subject?.subject_name));
            setSubjectListFilter(filteredSubject)

            const filteredQuizList = quizList.filter((quiz) => {
                if (!quiz?.class_stream_subjects) {
                    return false; // Explicitly return false
                }
                const streamsvaleues = Object.values(quiz?.class_stream_subjects);
                let streamList: string[] = [];
                for (const stream of streamsvaleues) {
                    const values = Object.keys(stream as { [key: string]: string | number });
                    streamList = streamList.concat(values.map(String));
                }

                const classesIds = Object.keys(quiz?.class_stream_subjects);
                return (classesIds.includes(String(selectClass?.id)) && streamList.includes(String(value)) && quiz?.created_by == selecteTeacher?.user_uuid)
            })
            setQuizListFilter(filteredQuizList);
        }

    }
    return (
        <div className="main-wrapper">
            <div className="main-content">
                {loading && <FullScreenLoader />}
                <Typography variant="h6" sx={{ m: 2 }}>
                    <div className="main_title"> Quiz List</div>
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: 'space-between',
                        gap: 1,
                        mb: 1,
                        mt: 1,
                        flexWrap: 'wrap',
                    }}
                >
                    <div className="col-md-2 col-12">
                        <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel id="teachers">Teachers</InputLabel>
                            <Select
                                labelId="teachers"
                                name="teacher_id"
                                label="teachers"
                                value={selecteTeacher?.id}
                                onChange={handleChanges}
                            >
                                {teacherDataList?.map((teacher) => (
                                    <MenuItem key={teacher?.id} value={teacher?.id}>{teacher?.first_name + " " + teacher?.last_name}</MenuItem>
                                ))
                                }
                            </Select>
                        </FormControl>
                    </div>
                    {entityType == "college" ?
                        <>
                            <div className="col-md-2 col-12">

                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel id="Courses">Courses</InputLabel>
                                    <Select
                                        labelId="Courses"
                                        name="course_id"
                                        label="Courses"
                                        value={selectedCourse}
                                        onChange={handleChanges}
                                    >
                                        {courseListFilter?.map((course) => (
                                            <MenuItem key={course?.id} value={course?.id}>{course?.course_name}</MenuItem>
                                        ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="col-md-2 col-12">

                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel id="semester">Semester</InputLabel>
                                    <Select
                                        labelId="semester"
                                        name="semester_id"
                                        label="semester"
                                        value={selectSemester}
                                        onChange={handleChanges}
                                    >
                                        {semesterListFilter?.map((semester) => (
                                            <MenuItem key={semester?.semester_id} value={semester?.semester_id}>{semester?.semester_number}</MenuItem>
                                        ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                        </>
                        :
                        <>
                            <div className="col-md-2 col-12">

                                <FormControl fullWidth variant="outlined" size="small">
                                    <InputLabel id="Class">Class</InputLabel>
                                    <Select
                                        labelId="Class"
                                        name="class_id"
                                        label="Class"
                                        value={selectClass?.id}
                                        onChange={handleChanges}
                                    >
                                        {classesListFilter?.map((clas) => (
                                            <MenuItem key={clas?.id} value={clas?.id}>{clas?.class_name}</MenuItem>
                                        ))
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                            {is_Stream &&
                                <div className="col-md-2 col-12">

                                    <FormControl fullWidth variant="outlined" size="small">
                                        <InputLabel id="stream">Stream</InputLabel>
                                        <Select
                                            labelId="stream"
                                            name="stream"
                                            label="stream"
                                            value={selectedStream}
                                            onChange={handleChanges}
                                        >
                                            {streamList?.filter((stream) => stream != "general")?.map((stream) => (
                                                <MenuItem key={stream} value={stream}>{stream}</MenuItem>
                                            ))
                                            }
                                        </Select>
                                    </FormControl>
                                </div>

                            }
                        </>
                    }

                    <div className="col-md-2 col-12">

                        <FormControl fullWidth variant="outlined" size="small">
                            <InputLabel id="subjects">Subjects</InputLabel>
                            <Select
                                labelId="subjects"
                                name="subject_id"
                                label="subjects"
                                value={selectSubject}
                                onChange={handleChanges}
                            >
                                {subjectListFilter?.map((subject) => (
                                    <MenuItem key={subject?.subject_id} value={subject?.subject_id}>{subject?.subject_name}</MenuItem>
                                ))
                                }
                            </Select>
                        </FormControl>
                    </div >
                </Box>
                <Box>
                    <MaterialReactTable
                        columns={columns}
                        data={quizListFilter}
                    />

                </Box>

            </div>

        </div>

    )
}

export default QuizzesList;