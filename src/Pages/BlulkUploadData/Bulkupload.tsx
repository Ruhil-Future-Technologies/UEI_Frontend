/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import BulkUploadForm from '../../Components/BulkUploadForm';
import { getModifyClassMane } from '../../utils/helpers';
import { QUERY_KEYS_CLASS, QUERY_KEYS_COURSE, QUERY_KEYS_SEMESTER, QUERY_KEYS_SUBJECT, QUERY_KEYS_SUBJECT_SCHOOL, QUERY_KEYS_TEACHER } from '../../utils/const';
import useApi from '../../hooks/useAPI';
import { toast } from 'react-toastify';

const Bulkupload = () => {
    const ClassURL = QUERY_KEYS_CLASS.GET_CLASS;
    const SubjectSchoolURL = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT;
    const SubjectCollegeURL = QUERY_KEYS_SUBJECT.GET_SUBJECT;
    const CourseListURL = QUERY_KEYS_COURSE.GET_COURSE;
    const SemesterURL = QUERY_KEYS_SEMESTER.GET_SEMESTER;
    const TeacherURL = QUERY_KEYS_TEACHER.GET_TEACHER;
    const { getData, postData } = useApi();
    const [selectedEntity] = useState<any>(localStorage.getItem('entity'));
    const [selectInstiutte] = useState<any>(localStorage.getItem('institute_id'));
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedStream, setSelectedStream] = useState<string | null>(null);
    const [dynamicClasses, setDynamicClasses] = useState<any[]>([]);
    const [dynamicSubject, setDynamicSubject] = useState<any[]>([]);
    const [Subject, setSubject] = useState<any[]>([]);
    const [dynamicTeacher, setDynamicTeacher] = useState<any[]>([]);
    const [repeatableRowsKey, setRepeatableRowsKey] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
    const [dynamicCourses, setDynamicCourses] = useState<any[]>([]);
    const [dynamicSem, setDynamicSem] = useState<any[]>([]);
    const streams = ['Science', 'Arts', 'Commerce'];
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const callAPI = async () => {
        if (selectedEntity === 'school') {
            getData(`${ClassURL}`)
                .then((response: any) => {
                    if (response.status) {
                        const filteredData = response?.data?.classes_data?.filter(
                            (item: any) => item?.is_active === true,
                        );

                        setDynamicClasses(filteredData || [])
                    }
                })
                .catch((error) => {
                    toast.error(error?.message, {
                        hideProgressBar: true,
                        theme: 'colored',
                        position: 'top-center',
                    });
                });
            getData(`${SubjectSchoolURL}`)
                .then((data: any) => {
                    if (data.status) {
                        const filteredData = data?.data?.subjects_data?.filter(
                            (item: any) => item.is_active && item.institution_id === selectInstiutte
                        );
                        setDynamicSubject(filteredData || []);
                    }
                })
                .catch((e) => {
                    toast.error(e?.message, {
                        hideProgressBar: true,
                        theme: 'colored',
                    });
                });
        }
        if (selectedEntity === 'college') {
            getData(`${CourseListURL}`)
                .then((data) => {
                    const filteredData = data?.data?.course_data?.filter(
                        (item: any) => item.is_active && item.institution_id === selectInstiutte
                    );
                    setDynamicCourses(filteredData);
                })
                .catch((e) => {
                    const errorMessage = e?.response?.data?.message || e?.message;
                    toast.error(errorMessage, {
                        hideProgressBar: true,
                        theme: 'colored',
                    });
                });
            getData(`${SemesterURL}`)
                .then((response: any) => {
                    if (response.status) {
                        const filteredData = response?.data?.semesters_data?.filter(
                            (item: any) => item?.is_active && item.institute_id === selectInstiutte
                        );
                        setDynamicSem(filteredData || []);
                    }
                })
                .catch((error) => {
                    const errorMessage = error?.response?.data?.message || error?.message;
                    toast.error(errorMessage, {
                        hideProgressBar: true,
                        theme: 'colored',
                        position: 'top-center',
                    });
                });
            getData(`${SubjectCollegeURL}`)
                .then((response: any) => {
                    if (response.status) {
                        const filteredData = response?.data?.subjects_data?.filter(
                            (item: any) => item?.is_active && item.institution_id === selectInstiutte
                        );
                        setDynamicSubject(filteredData || []);
                    }
                })
                .catch((error) => {
                    const errorMessage = error?.response?.data?.message || error?.message;
                    toast.error(errorMessage, {
                        hideProgressBar: true,
                        theme: 'colored',
                        position: 'top-center',
                    });
                });

        }
        getData(`${TeacherURL}`)
            .then((data) => {
                if (data.status) {
                    const filteredData = data?.data?.filter(
                        (item: any) => item?.is_active && item.institute_id === selectInstiutte
                    );
                    setDynamicTeacher(filteredData || []);
                }
            })
            .catch((error) => {
                const errorMessage = error?.response?.data?.message || error?.message;
                toast.error(errorMessage, {
                    hideProgressBar: true,
                    theme: 'colored',
                    position: 'top-center',
                });
            });
    };


    useEffect(() => {
        callAPI();
    }, []);
    useEffect(() => {
        if (selectedEntity === 'college') {
            // Filter subjects for college based on course_id and semester_id
            const subjectFilter = dynamicSubject.filter(
                (item) =>
                    item.course_id?.toString() === selectedCourse?.toString() &&
                    item.semester_id?.toString() === selectedSemester?.toString()
            );
            setSubject(subjectFilter);
        } else {
            // Existing school subject filtering logic
            const subjectFilter = dynamicSubject.filter(
                (item) =>
                    item.class_id?.toString() == selectedClass?.toString() &&
                    (selectedStream == null || item.stream?.toLowerCase()?.toString() === selectedStream?.toLowerCase()?.toString())
            );
            setSubject(subjectFilter);
        }

        // Trigger reset of repeatable rows when selections change
        if (selectedEntity === 'college') {
            if (selectedCourse !== null && selectedSemester !== null) {
                setRepeatableRowsKey(prevKey => prevKey + 1);
            }
        } else {
            if (selectedClass !== null) {
                setRepeatableRowsKey(prevKey => prevKey + 1);
            }
        }
    }, [selectedClass, selectedStream, selectedCourse, selectedSemester, dynamicSubject, selectedEntity]);

    // Effect to clear selected stream when selected class changes
    useEffect(() => {
        if (selectedClass !== null) { // Only clear if a class is actually selected
            setSelectedStream(null);
        }
    }, [selectedClass]);

    // Define the main fields configuration for the college entity
    const mainFieldsConfigCollege = [
        {
            key: 'course',
            label: 'Course',
            placeholder: 'Select Course',
            value: selectedCourse,
            onChange: setSelectedCourse,
            // options: courses.map(course => ({ value: course, label: course })),
            options: dynamicCourses?.map(course => ({ value: course?.id, label: course?.course_name })),
            isVisible: true,
        },
        {
            key: 'semester',
            label: 'Semester',
            placeholder: 'Select Semester',
            value: selectedSemester,
            // Add logic to clear subject and teacher when semester changes
            onChange: (value: string | null) => {
                setSelectedSemester(value);
                // Increment repeatableRowsKey to reset subject and teacher rows
                setRepeatableRowsKey(prevKey => prevKey + 1);
            },
            options: dynamicSem
                ?.filter(sem => selectedCourse !== null && sem?.course_id?.toString() === selectedCourse.toString())
                .sort((a, b) => (a?.semester_number ?? 0) - (b?.semester_number ?? 0))
                .map(sem => ({ value: sem?.semester_id, label: sem?.semester_number })),
            isVisible: true,
        },
        // Add any other main fields specific to college here
    ];

    // Define the repeatable fields configuration for college (e.g., Subject and Teacher might be the same)
    const repeatableFieldsConfigCollege = [
        {
            key: 'subject',
            label: 'Subject',
            placeholder: 'Select Subject',
            options: Subject?.map(subject => ({ value: subject.subject_id, label: subject.subject_name })),
        },
        {
            key: 'teacher',
            label: 'Teacher',
            placeholder: 'Select Teacher',
            options: [], // Initial empty options, will be dynamically populated
            getDynamicOptions: (mainFieldValues: { [key: string]: any }, currentRowValues: { [key: string]: any }, dynamicData: any, entityType: 'school' | 'college'): any[] => {
                if (!dynamicData || !dynamicData.dynamicTeacher) return [];
                const teachers = dynamicData.dynamicTeacher;
                const selectedSubjectId = currentRowValues.subject; // Get the selected subject ID in the current row
                const semlable = getMainFieldValues()
                // Find the selected subject object to get its name
                const selectedSubjectObj = Subject?.find(sub => sub.subject_id === selectedSubjectId);
                const selectedSubjectName = selectedSubjectObj?.subject_name; // Get the subject name

                if (entityType === 'college') {
                    const selectedCourseId = mainFieldValues.course;
                    const selectedSemesterId = mainFieldValues.semester;
                    const selectedSemesterLabel = semlable?.semester?.label;
                    if (!selectedCourseId || !selectedSemesterId || !selectedSemesterLabel || !selectedSubjectName) return [];

                    return teachers
                        .filter((teacher: any) =>
                            teacher.course_semester_subjects &&
                            teacher.course_semester_subjects[selectedCourseId] &&
                            teacher.course_semester_subjects[selectedCourseId][selectedSemesterLabel] &&
                            Array.isArray(teacher.course_semester_subjects[selectedCourseId][selectedSemesterLabel]) &&
                            teacher.course_semester_subjects[selectedCourseId][selectedSemesterLabel].some(
                                (subject: string) =>
                                    subject?.toLowerCase().trim() === selectedSubjectName?.toLowerCase().trim()
                            )
                        )
                        .map((teacher: any) => ({
                            value: teacher.id,
                            label: `${teacher.first_name} ${teacher.last_name}`,
                        }));

                }
                return []; // Return empty array if not college entity or conditions not met
            }
        },
        // Add or change repeatable fields as needed for college
    ];
    // Define the main fields configuration for the school entity
    const mainFieldsConfig = [
        {
            key: 'class',
            label: 'Class',
            placeholder: 'Select Class',
            value: selectedClass,
            onChange: setSelectedClass,
            // Use dynamicClasses for options, mapping id to value and class_name to label
            options: dynamicClasses.map(cls => ({ value: cls.id, label: getModifyClassMane(cls.class_name) })),
            isVisible: true, // Always visible for school
        },
        {
            key: 'stream',
            label: 'Stream',
            placeholder: 'Select Stream',
            value: selectedStream,
            onChange: setSelectedStream,
            options: streams.map(stream => ({ value: stream, label: stream })),
            isVisible: dynamicClasses.some(cls =>
                cls.id === selectedClass && (cls.class_name === 'class_11' || cls.class_name === 'class_12')
            ),
        },
    ].filter(field => field.isVisible);

    // Define the repeatable fields configuration for Subject and Teacher
    const repeatableFieldsConfig = [
        {
            key: 'subject',
            label: 'Subject',
            placeholder: 'Select Subject',
            options: Subject?.map(subject => ({ value: subject.subject_id, label: subject.subject_name })),
        },
        {
            key: 'teacher',
            label: 'Teacher',
            placeholder: 'Select Teacher',
            options: [], // Initial empty options, will be dynamically populated
            getDynamicOptions: (mainFieldValues: { [key: string]: any }, currentRowValues: { [key: string]: any }, dynamicData: any, entityType: 'school' | 'college'): any[] => {
                if (!dynamicData || !dynamicData.dynamicTeacher) return [];
                const teachers = dynamicData.dynamicTeacher;
                const selectedSubjectId = currentRowValues.subject; // Get the selected subject ID in the current row

                // Find the selected subject object to get its name
                const selectedSubjectObj = Subject?.find(sub => sub.subject_id === selectedSubjectId);
                const selectedSubjectName = selectedSubjectObj?.subject_name; // Get the subject name

                if (entityType === 'school') {
                    const selectedClassId = mainFieldValues.class;
                    const selectedStreamName = mainFieldValues.stream;

                    if (!selectedClassId || !selectedSubjectName) return [];

                    // Find the class object to get its name
                    const selectedClassObj = dynamicClasses.find(cls => cls.id === selectedClassId);
                    if (!selectedClassObj) return [];

                    // Determine the stream key to look for in teacher data
                    let streamKey = selectedStreamName?.toLowerCase();
                    // Check if the class is 11 or 12 before assuming a stream is required in the teacher data structure
                    const isClass11or12 = dynamicClasses.some(cls => cls.id === selectedClassId && (cls.class_name === 'class_11' || cls.class_name === 'class_12'));

                    if (!isClass11or12) {
                        streamKey = 'general'; // Use 'general' for classes not 11 or 12
                    }

                    if (!streamKey) return []; // Should not happen if logic is correct, but for safety
                    return teachers
                        .filter((teacher: any, index: number) => {
                            let subjectsData = teacher.class_stream_subjects;

                            if (typeof subjectsData === "string") {
                                try {
                                    subjectsData = JSON.parse(subjectsData);
                                } catch (e) {
                                    console.warn(`Invalid JSON at index ${index}`);
                                    return false;
                                }
                            }

                            const classKey = String(selectedClassId);
                            const subjectList = subjectsData?.[classKey]?.[streamKey];

                            if (Array.isArray(subjectList)) {
                                return subjectList.some(
                                    (subject) =>
                                        subject?.toLowerCase().trim() ===
                                        selectedSubjectName?.toLowerCase().trim()
                                );
                            }

                            return false;
                        })
                        .map((teacher: any) => ({
                            value: teacher.id,
                            label: `${teacher.first_name} ${teacher.last_name}`,
                        }));
                }

                return []; // Return empty array if not school entity or conditions not met
            }
        },
    ];
    // Define the submit handler for the college entity (similar to handleSchoolSubmit but with college payload)
    const handleCollegeSubmit = async (formData: FormData, mainFieldValues: { [key: string]: any }, repeatableRowValues: Array<{ [key: string]: any }>) => {
        const subjects = repeatableRowValues.map(row => row.subject);
        const teachers = repeatableRowValues.map(row => row.teacher);

        const subject_preference = {
            subject: subjects,
            teacher: teachers,
        };

        formData.append('institute_id', selectInstiutte);
        formData.append('entity', selectedEntity);
        formData.append('subject_preference', JSON.stringify(subject_preference));
        formData.append('course', JSON.stringify(mainFieldValues.course));
        formData.append('semester', JSON.stringify(mainFieldValues.semester));

        try {
            postData('bulk-upload/upload', formData).then((data: any) => {
                if (data?.status) {
                    setSelectedCourse(null);
                    setSelectedSemester(null);
                    // Set download URL from response
                    setDownloadUrl(data?.data?.confirmation_file?.download_url || null);
                    toast.success('College data uploaded successfully', {
                        hideProgressBar: true,
                        theme: 'colored',
                    });
                } else {
                    message.error('College data upload failed');
                    setDownloadUrl(null);
                }
            });
        } catch (error) {
            console.error('Upload error:', error);
            setDownloadUrl(null);
        }
    };
    // Define the submit handler for the school entity
    const handleSchoolSubmit = async (formData: FormData, mainFieldValues: { [key: string]: any }, repeatableRowValues: Array<{ [key: string]: any }>) => {
        const subjects = repeatableRowValues.map(row => row.subject);
        const teachers = repeatableRowValues.map(row => row.teacher);

        const subject_preference = {
            subject: subjects,
            teacher: teachers,
        };

        formData.append('institute_id', selectInstiutte);
        formData.append('entity', selectedEntity);
        formData.append('subject_preference', JSON.stringify(subject_preference));
        formData.append('class', JSON.stringify(mainFieldValues.class));
        if (mainFieldValues.stream) {
            formData.append('stream', mainFieldValues.stream);
        } else {
            formData.append('stream', "general");
        }

        try {
            postData('bulk-upload/upload', formData).then((data: any) => {
                if (data?.status) {
                    setSelectedClass(null);
                    setSelectedStream(null);
                    // Set download URL from response
                    setDownloadUrl(data?.data?.confirmation_file?.download_url || null);
                    toast.success('School data uploaded successfully', {
                        hideProgressBar: true,
                        theme: 'colored',
                    });
                } else {
                    message.error('School data upload failed');
                    setDownloadUrl(null);
                }
            });
        } catch (error) {
            console.error('Upload error:', error);
            setDownloadUrl(null);
        }
    };

    // Effect to trigger repeatable rows reset based on selected entity and main fields
    useEffect(() => {
        if (selectedEntity === 'school') {
            // Trigger reset of repeatable rows when selectedClass or selectedStream changes for school
            if (selectedClass !== null) { // Only reset if a class is actually selected
                setRepeatableRowsKey(prevKey => prevKey + 1);
            }
        } else if (selectedEntity === 'college') {
            // Trigger reset of repeatable rows when selectedCourse or selectedSemester changes for college
            if (selectedCourse !== null) { // Only reset if a course is actually selected
                setRepeatableRowsKey(prevKey => prevKey + 1);
            }
        }
    }, [selectedEntity, selectedClass, selectedStream, selectedCourse, selectedSemester, dynamicSubject]); // Added college dependencies and selectedEntity

    // Effect to clear selected stream when selected class changes (for school)
    useEffect(() => {
        if (selectedEntity === 'school' && selectedClass !== null) { // Only clear if school entity and a class is actually selected
            setSelectedStream(null);
        }
    }, [selectedEntity, selectedClass]);

    // Effect to clear selected semester when selected course changes (for college)
    useEffect(() => {
        if (selectedEntity === 'college' && selectedCourse !== null) { // Only clear if college entity and a course is actually selected
            setSelectedSemester(null);
        }
    }, [selectedEntity, selectedCourse]);

    const getMainFieldValues = () => {
        const values: { [key: string]: any } = {};
        mainFieldsConfigCollege.forEach(field => {
            if (field.key) {
                if (field.key === 'semester') {
                    // For semester, store both ID and label
                    const selectedSem = dynamicSem.find(sem => sem.semester_id === field.value);
                    values[field.key] = {
                        id: field.value,
                        label: selectedSem?.semester_number || ''
                    };
                } else {
                    values[field.key] = field.value;
                }
            }
        });
        return values;
    };

    // Add download handler
    const handleDownload = () => {
        if (downloadUrl) {
            window.open(downloadUrl, '_blank');
        }
    };

    return (
        <div>
            <BulkUploadForm
                title={selectedEntity !== "school" ? "College Data Upload" : "School Data Upload"}
                mainFields={selectedEntity !== "school" ? mainFieldsConfigCollege : mainFieldsConfig}
                repeatableFieldsConfig={selectedEntity !== "school" ? repeatableFieldsConfigCollege : repeatableFieldsConfig}
                onSubmit={selectedEntity !== "school" ? handleCollegeSubmit : handleSchoolSubmit}
                downloadTemplateApiEndpoint={'/bulk-upload/download'}
                resetTrigger={repeatableRowsKey}
                dynamicData={{ dynamicTeacher, dynamicClasses, dynamicSubject }}
                entityType={selectedEntity}
            />
            {downloadUrl && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button
                        onClick={handleDownload}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#1890ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Download Confirmation File
                    </button>
                </div>
            )}
        </div>
    );
};

export default Bulkupload;