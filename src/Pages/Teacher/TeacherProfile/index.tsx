import { Checkbox, FormControl, FormControlLabel, InputLabel, List, ListItem, ListItemText, MenuItem, OutlinedInput, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import React, { ChangeEvent, useContext, useEffect, useState, } from "react";
import { qualifications, Teacher } from "../../TeacherRgistrationForm";
import useApi from "../../../hooks/useAPI";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import NameContext from "../../Context/NameContext";
import maleImage from '../../../assets/img/avatars/male.png';
import {
    fieldIcon,
    inputfield,
    inputfieldhover,
    inputfieldtext,
} from '../../../utils/helpers';
import { CourseRep0oDTO, IClass, IEntity, InstituteRep0oDTO, SubjectRep0oDTO } from "../../../Components/Table/columns";
import { toast } from "react-toastify";
import { QUERY_KEYS, QUERY_KEYS_CLASS, QUERY_KEYS_COURSE, QUERY_KEYS_SUBJECT, QUERY_KEYS_SUBJECT_SCHOOL } from "../../../utils/const";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { useNavigate } from "react-router-dom";
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';


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
const TeacherProfile = () => {
    const stream = [
        "Science",
        "Commerce",
        "Arts",
    ]
    const navigate = useNavigate();
    const teacherLoginId = localStorage.getItem("_id");
    const context = useContext(NameContext);
    const { namecolor }: any = context;
    const { getData, postFileData, putData } = useApi();
    const InstituteEntityURL = QUERY_KEYS.ENTITY_LIST;
    const InstituteURL = QUERY_KEYS.GET_INSTITUTES;
    const CourseURL = QUERY_KEYS_COURSE.GET_COURSE;
    const getsubjectSchool = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT;
    const getSubjectCollege = QUERY_KEYS_SUBJECT.GET_SUBJECT;
    const ClassURL = QUERY_KEYS_CLASS.GET_CLASS;

    const [teacherData, setTeacherData] = useState<Teacher>(
        {
            first_name: '',
            last_name: '',
            gender: '',
            dob: dayjs('dd-mm-yyyy'),
            email_id: '',
            phone: '',
            address: '',
            country: '',
            state: '',
            stream: '',
            district: '',
            city: '',
            pincode: '',
            qualification: '',
            experience: '',
            subjects: [''],
            role_id: '',
            entity_id: '',
            class_id: '',
            course_id: '',
            institution_id: '',
            school_name: '',
            documents: [],
            is_verified: false,
            is_kyc_verified: false,
            pic_path: '',
        }
    );

    const [genderData, setGenderData] = useState('male');
    const [dataEntity, setDataEntity] = useState<IEntity[]>([]);
    const [dataClass, setDataClass] = useState<IClass[]>([]);
    const [documents, setDocuments] = useState<File[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedEntity, setSelectedEntity] = useState('');
    const [institutionsData, setInstitutionsData] = useState<InstituteRep0oDTO[]>([]);
    const [coursesData, setCoursesData] = useState<CourseRep0oDTO[]>([])
    const [filteredcoursesData, setFilteredCoursesData] = useState<CourseRep0oDTO[]>([])
    const [totleSubject, setTotleSubject] = useState<SubjectRep0oDTO[]>([]);
    const exactYearsAgo = dayjs()?.subtract(18, 'year');
    const minSelectableDate = dayjs('01/01/1920');
    const [filePreview, setFilePreview] = useState(null);
    const [selectedClassName, setSelectedClassName] = useState("col-12");
    const [selectedFile, setSelectedFile] = useState('');

    const [dob_error, setDob_error] = useState<boolean>(false);
    const [first_name_error, setFirst_name_error] = useState<boolean>(false);
    const [last_name_error, setLast_name_error] = useState<boolean>(false);
    const [institute_name_error, setInstitute_name_error] = useState<boolean>(false);
    const [mobile_no_error, setMobile_no_error] = useState<boolean>(false);
    const [pincode_error, setPincode_error] = useState<boolean>(false);
    const [address_error, setAddress_error] = useState<boolean>(false);
    const [district_error, setDistrict_error] = useState<boolean>(false);
    const [city_error, setCity_error] = useState<boolean>(false);
    const [state_error, setState_error] = useState<boolean>(false);
    const [country_error, setCountry_error] = useState<boolean>(false);
    const [experience_error, setExperience_error] = useState<boolean>(false);
    const [subjects_error, setSubjects_error] = useState<boolean>(false);
    const [teacherId, setTeacherId] = useState('');

    useEffect(() => {
        getTeacherProfileInfo()
        getEntity();
        // getInstitutelist();
        //getCourses();
        getClasslist();
    }, [])
    const getClasslist = () => {
        getData(`${ClassURL}`)
            .then((data) => {
                if (data.data) {
                    setDataClass(data?.data);
                }
            })
            .catch((e) => {
                if (e?.response?.status === 401) {
                    navigate('/');
                }
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: 'colored',
                });
            });
    };
    const getSubjects = (type: string) => {
        if (type === 'College') {
            getData(`${getSubjectCollege}`)
                .then((data) => {
                    if (data.data) {
                        setTotleSubject(data?.data);
                    }
                })
                .catch((e) => {

                    toast.error(e?.message, {
                        hideProgressBar: true,
                        theme: 'colored',
                    });
                });
        } else {
            getData(`${getsubjectSchool}`)
                .then((data) => {
                    if (data.data) {
                        setTotleSubject(data?.data);
                    }
                })
                .catch((e) => {

                    toast.error(e?.message, {
                        hideProgressBar: true,
                        theme: 'colored',
                    });
                });
        }
    };
    const getCourses = (instituteId: any) => {
        getData(`${CourseURL}`)
            .then((data: { data: CourseRep0oDTO[] }) => {
                if (data.data) {
                    setCoursesData(data?.data);
                    const filtredCourses = data.data.filter((course) => course.institution_id === instituteId)
                    setFilteredCoursesData(filtredCourses)
                }

            })
            .catch((e) => {
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: 'colored',
                });
            });
    };
    const getInstitutelist = async (entityId: any) => {
        getData(`${InstituteURL}`)
            .then((data) => {
                console.log(data.data);
                const fiteredInstitutedata = data.data.filter(
                    (institute: any) => institute.is_active === 1 && institute.is_approve === true && institute.entity_id === entityId);
                if (data.data) {
                    setInstitutionsData(fiteredInstitutedata);
                }
            })
            .catch((e) => {
                if (e?.response?.status === 401) {

                }
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: 'colored',
                });
            });
    };
    const getEntity = () => {
        getData(`${InstituteEntityURL}`)
            .then((data: { data: IEntity[] }) => {
                const filteredData = data?.data.filter(
                    (entity) => entity.is_active === 1,
                );
                setDataEntity(filteredData);
                // setDataEntity(data?.data)
            })
            .catch((e) => {
                if (e?.response?.status === 401) {

                }
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: 'colored',
                });
            });
    };
    const getTeacherProfileInfo = () => {
        try {
            getData(`/teacher/getbyloginid/${teacherLoginId}`).then((data) => {
                console.log(data);
                if (data?.status === 200) {
                    setTeacherData(data.data);
                    setGenderData(data.data.gender);
                    setSelectedSubjects(data.data.subjects);
                    setTeacherId(data.data.teacher_id);
                    if (data.data.course_id !== "None") {
                        console.log("inside university");
                        getSubjects('College');
                        setSelectedEntity('College');
                        getCourses(data.data.institution_id);
                    } else {
                        getSubjects('School');
                        setSelectedEntity('School');
                    }
                    if (data.data.stream) {
                        setSelectedClassName("col-6")

                    }
                    getInstitutelist(data.data.entity_id);


                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'first_name' && !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value.trim())) {
            setFirst_name_error(true);
        } else {
            setFirst_name_error(false);
        }
        if (name === 'last_name' && !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value.trim())) {
            setLast_name_error(true);
        } else {
            setLast_name_error(false);
        }
        if (name === 'gender') {
            setGenderData(value);
        }
        if (name === "phone" && !/^(?!0{10})[0-9]{10}$/.test(value)) {
            setMobile_no_error(true);
        } else {
            setMobile_no_error(false);
        }
        if (name === "pincode" && !/^(?!0{6})[0-9]{6}$/.test(value)) {
            setPincode_error(true);
        } else {
            setPincode_error(false);
        }

        if (name === "address" && !/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(value)) {
            setAddress_error(true);
        } else {
            setAddress_error(false);
        }
        if (name === "district" && !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value)) {
            setDistrict_error(true);
        } else {
            setDistrict_error(false);
        }
        if (name === "city" && !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value)) {
            setCity_error(true);
        } else {
            setCity_error(false);
        }
        if (name === "experience" && !/^\d+$/.test(value)) {
            setExperience_error(true);
        } else {
            setExperience_error(false);
        }
        setTeacherData({ ...teacherData, [name]: value });
    }

    const handleDate = (date: Dayjs | null) => {

        if (date && date.isValid() && date >= minSelectableDate) {
            if (date && date.isBefore(exactYearsAgo, 'day')) {
                setTeacherData((values) => ({ ...values, dob: date }));
                setDob_error(false);
            } else {
                setDob_error(true);
            }
        } else {
            setDob_error(true);
        }

    }

    const handleSelect = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        console.log(name, value);
        if (name === 'entity_id') {
            dataEntity.map((item) => {
                if (String(item.id) == value) {
                    setSelectedEntity(item.entity_type);
                    getSubjects(item.entity_type);
                }
            });
        }
        if (name === "institution_id" && value === "") {

            setInstitute_name_error(true)
        } else {
            if (name === "institution_id") {
                const filteredCourse = coursesData.filter((course) => course.institution_id === value)
                setFilteredCoursesData(filteredCourse);
            }
            setInstitute_name_error(false)
        }

        if (name === "class_id") {
            console.log(value);
            const selectedClass = dataClass.find(
                (item) => String(item.id) === value,
            )?.class_name;
            if (selectedClass === "class_11" || selectedClass === "class_12") {
                setSelectedClassName("col-6")
            } else {
                setSelectedClassName("col-12")
            }

        }
        setTeacherData({ ...teacherData, [name]: value })

    }
    const handelSubjectChange = (
        event: SelectChangeEvent<typeof selectedSubjects>,
    ) => {
        const { value } = event.target;
        setSubjects_error(false);
        setSelectedSubjects(value as string[]);
    };
    const handleInputChangecountry = (val: string, name: string) => {
        if (name === "state" && val === "") {
            setState_error(true);
        } else {
            setState_error(false);
        }
        if (name === "country" && val === "") {
            setCountry_error(true);
        } else {
            setCountry_error(false);
        }
        setTeacherData((teacher) => ({ ...teacher, [name]: val }));
        if (name === 'country') {
            setTeacherData((prevState) => ({ ...prevState, ['state']: '' }));
        }

    };
    const handleSubmit = () => {

        if (!/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(teacherData.address)) {
            setAddress_error(true);
            return;
        }
        if (teacherData.institution_id === '') {
            setInstitute_name_error(true);
            return;
        }
        if (!teacherData?.dob) {
            setDob_error(true);
            return;
        }
        if (!/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
            teacherData.first_name.trim(),
        )) {
            setFirst_name_error(true);
            return;
        }
        if (!/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
            teacherData.last_name.trim(),
        )) {
            setLast_name_error(true);
            return;
        }
        if (!/^(?!0{10})[0-9]{10}$/.test(teacherData.phone)) {
            setMobile_no_error(true);
            return;
        }
        if (!/^(?!0{6})[0-9]{6}$/.test(teacherData.pincode)) {
            setPincode_error(true);
            return;
        }
        if (!/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
            teacherData.district.trim(),
        )) {
            setDistrict_error(true);
            return;
        }
        if (!/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
            teacherData.city.trim(),
        )) {
            setCity_error(true);
            return;
        }
        if (teacherData.state === '') {
            setState_error(true);
            return;
        }
        if (teacherData.country === '') {
            setCountry_error(true);
            return;
        }
        if (!/^\d+$/.test(teacherData.experience)) {
            setExperience_error(true);
            return;
        }
        if (selectedSubjects.length === 0) {
            setSubjects_error(true);
            return;
        }

        let payload = {
            first_name: teacherData.first_name,
            last_name: teacherData.last_name,
            email_id: teacherData.email_id,
            phone: teacherData.phone,
            address: teacherData.address,
            district: teacherData.district,
            city: teacherData.city,
            pincode: teacherData.pincode,
            dob: teacherData.dob,
            role_id: 'c848bc42-0e62-46b1-ab2e-2dd4f9bef546',
            gender: teacherData.gender,
            entity_id: teacherData.entity_id,
            institution_id: teacherData.institution_id || null,
            experience: teacherData.experience,
            ...(selectedEntity === "College" && { course_id: teacherData.course_id }),
            ...(selectedEntity === "School" && { class_id: teacherData.class_id }),
            subjects: selectedSubjects,
            qualification: teacherData.qualification,
            state: teacherData.state,
            country: teacherData.country,
            ...(selectedClassName === "col-6" && { stream: teacherData.stream }),
        }
        console.log(payload);
        try {
            putData(`/teacher/edit/${teacherId}`, payload).then((response) => {
                if (response.status === 200) {
                    toast.success(response.message, {
                        hideProgressBar: true,
                        theme: 'colored',
                        position: 'top-center',
                    });
                } else {
                    toast.error(response.message, {
                        hideProgressBar: true,
                        theme: 'colored',
                        position: 'top-center',
                    });
                }
            })
        } catch (error) {

        }
        console.log(teacherData);
    }
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const formData = new FormData();

        if (files && files[0]) {
            const file: any = files[0];
            if (file.size > 3 * 1024 * 1024) {
                return;
            }
            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
                return;
            }
            setSelectedFile(file.name);
            const reader: any = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
            formData.append('file', file);
            postFileData(`${'upload_file/upload'}`, formData)
                .then((data: any) => {
                    if (data?.status === 200) {
                        toast.success(data?.message, {
                            hideProgressBar: true,
                            theme: 'colored',
                            position: 'top-center',
                        });
                    } else if (data?.status === 404) {
                        toast.error(data?.message, {
                            hideProgressBar: true,
                            theme: 'colored',
                            position: 'top-center',
                        });
                    } else {
                        toast.error(data?.message, {
                            hideProgressBar: true,
                            theme: 'colored',
                            position: 'top-center',
                        });
                    }
                })
                .catch((e: any) => {
                    toast.error(e?.message, {
                        hideProgressBar: true,
                        theme: 'colored',
                        position: 'top-center',
                    });
                });
        }
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files && event.target.name !== 'icon') {
            const filesArray = Array.from(files); // Convert FileList to an array

            setDocuments((prevFiles) => [
                ...prevFiles, // Keep previously selected files
                ...filesArray, // Add newly selected files
            ]);
        } else {
            // setLogo(files);
        }

    };

    const handleDocumentClick = (url: string) => {
        window.open(url, "_blank");
    };

    console.log(selectedFile, teacherId);
    return (
        <div className="main-wrapper">
            <div className="main-content">
                <div className="container mb-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6 px-0">

                            <h4 className="fs-1 fw-bold">
                                My <span style={{ color: '#9943EC' }}> Profile </span>
                            </h4>
                        </div>
                        <div className="row">
                            <div className="card rounded-5 mt-3 bg-transparent-mb">
                                <div className="card-body p-0">
                                    <div className="row">
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                First Name<span>*</span>
                                            </label>
                                            <TextField
                                                className="form-control"
                                                name="first_name"
                                                value={teacherData?.first_name}
                                                onChange={handleChange}
                                            />
                                            {
                                                first_name_error &&
                                                <p className="error-text " style={{ color: 'red' }}>
                                                    <small>Please enter valid first name</small>
                                                </p>

                                            }
                                        </div>
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                Last Name<span>*</span>
                                            </label>
                                            <TextField
                                                className="form-control"
                                                name="last_name"
                                                value={teacherData?.last_name}
                                                onChange={handleChange}
                                            />
                                            {
                                                last_name_error &&
                                                <p className="error-text " style={{ color: 'red' }}>
                                                    <small>Please enter valid last name</small>
                                                </p>

                                            }
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                Gender <span>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                                    name="gender"
                                                    value={genderData}
                                                    onChange={handleChange}
                                                >
                                                    <FormControlLabel
                                                        value="male"
                                                        control={<Radio />}
                                                        label="Male"
                                                    />
                                                    <FormControlLabel
                                                        value="female"
                                                        control={<Radio />}
                                                        label="Female"
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                Dath of bitrh<span>*</span>
                                            </label>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer
                                                    components={[
                                                        'DatePicker',
                                                        'MobileDatePicker',
                                                        'DesktopDatePicker',
                                                        'StaticDatePicker',
                                                    ]}
                                                >
                                                    <DemoItem>
                                                        <DatePicker
                                                            name="dob"
                                                            value={dayjs(teacherData?.dob)}
                                                            onChange={handleDate}
                                                            format="DD/MM/YYYY"
                                                            minDate={minSelectableDate}
                                                            maxDate={exactYearsAgo}
                                                        />
                                                    </DemoItem>
                                                </DemoContainer>
                                                {
                                                    dob_error &&
                                                    <p className="error-text " style={{ color: 'red' }}>
                                                        <small>Please select a valid date of birth</small>
                                                    </p>
                                                }
                                            </LocalizationProvider>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                Phone No<span>*</span>
                                            </label>
                                            <TextField
                                                className="form-control"
                                                value={teacherData.phone}
                                                name="phone"
                                                onChange={handleChange}
                                            />
                                            {mobile_no_error === true && (
                                                <p className="error-text " style={{ color: 'red' }}>
                                                    <small>Please enter a valid mobile no.</small>
                                                </p>
                                            )}
                                        </div>
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                Email Id<span>*</span>
                                            </label>
                                            <TextField
                                                className="form-control"
                                                value={teacherData.email_id}
                                                name="email_id"
                                                onChange={handleChange}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                Entity<span>*</span>
                                            </label>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Entity *</InputLabel>
                                                <Select
                                                    onChange={(e: SelectChangeEvent<string>) => handleSelect(e)}
                                                    label="Entity"
                                                    name="entity_id"
                                                    disabled
                                                    value={teacherData?.entity_id}
                                                    variant="outlined"
                                                    sx={{
                                                        backgroundColor: inputfield(namecolor),
                                                        color: inputfieldtext(namecolor),
                                                        '& .MuiSelect-icon': {
                                                            color: fieldIcon(namecolor),
                                                        },
                                                    }}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                backgroundColor: inputfield(namecolor),
                                                                color: inputfieldtext(namecolor),
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {dataEntity.map((item, idx) => (
                                                        <MenuItem
                                                            value={item.id}
                                                            key={`${item.entity_type}-${idx + 1}`}
                                                            sx={{
                                                                backgroundColor: inputfield(namecolor),
                                                                color: inputfieldtext(namecolor),
                                                                '&:hover': {
                                                                    backgroundColor: inputfieldhover(namecolor),
                                                                },
                                                            }}
                                                        >
                                                            {item.entity_type}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>
                                        {selectedEntity === 'School' ? (
                                            <div className="col-md-6 col-12 mb-3">
                                                <label className="col-form-label">
                                                    Class<span>*</span>
                                                </label>

                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-multiple-name-label">class</InputLabel>
                                                    <Select
                                                        labelId="demo-multiple-name-label"
                                                        id="demo1-multiple-name"
                                                        name="class_id"
                                                        onChange={handleSelect}
                                                        value={teacherData.class_id}
                                                        input={<OutlinedInput label="Branch" />}
                                                    >
                                                        {dataClass.map((item) => (
                                                            <MenuItem key={item.id} value={item.id}>
                                                                {item.class_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                {/* {error.class_id_error === true && (
                                                          <p className="error-text " style={{ color: 'red' }}>
                                                            <small>Please select a class.</small>
                                                          </p>
                                                        )} */}
                                            </div>
                                        ) : (
                                            <div className="col-md-6 pb-3 form_field_wrapper">
                                                <label className="col-form-label">
                                                    Qualifications<span>*</span>
                                                </label>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-multiple-name-label">
                                                        Qualification
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-multiple-name-label"
                                                        id="demo1-multiple-name"
                                                        name="qualification"
                                                        onChange={handleSelect}
                                                        value={teacherData.qualification}
                                                        input={<OutlinedInput label="Qualification" />}
                                                    >
                                                        {qualifications.map((item) => (
                                                            <MenuItem key={item} value={item}>
                                                                {item}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        )}
                                    </div>
                                    {selectedEntity === "School" ? (
                                        <div className="row d-flex justify-content-center">
                                            <div className={selectedClassName}>
                                                <label className="col-form-label">
                                                    School Name<span>*</span>
                                                </label>
                                                <FormControl fullWidth>
                                                    <InputLabel id="school_id">School Name</InputLabel>
                                                    <Select
                                                        labelId="school_id"
                                                        id="demo2-multiple-name"
                                                        name="institution_id"
                                                        label="School Name"
                                                        onChange={handleSelect}
                                                        value={teacherData.institution_id}
                                                        sx={{
                                                            backgroundColor: inputfield(namecolor),
                                                            color: inputfieldtext(namecolor),
                                                            '& .MuiSelect-icon': {
                                                                color: fieldIcon(namecolor),
                                                            },
                                                        }}
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    backgroundColor: inputfield(namecolor),
                                                                    color: inputfieldtext(namecolor),
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        {institutionsData.map((item) => (
                                                            <MenuItem
                                                                key={item.id}
                                                                value={item.id}
                                                                sx={{
                                                                    backgroundColor: inputfield(namecolor),
                                                                    color: inputfieldtext(namecolor),
                                                                    '&:hover': {
                                                                        backgroundColor: inputfieldhover(namecolor),
                                                                    },
                                                                }}
                                                            >
                                                                {item.institution_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    {institute_name_error === true && (
                                                        <p className="error-text " style={{ color: 'red' }}>
                                                            <small>Please select a institution name.</small>
                                                        </p>
                                                    )}
                                                </FormControl>
                                            </div>
                                            {selectedClassName === "col-6" && (
                                                <div className='col-md-6 col-12 mb-3'>
                                                    <label className="col-form-label">
                                                        Stream Name<span>*</span>
                                                    </label>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="school_id">Stream Name</InputLabel>
                                                        <Select
                                                            labelId="school_id"
                                                            id="demo2-multiple-name"
                                                            name="stream"
                                                            label="Stream Name"
                                                            value={teacherData.stream}
                                                            onChange={handleSelect}
                                                            sx={{
                                                                backgroundColor: inputfield(namecolor),
                                                                color: inputfieldtext(namecolor),
                                                                '& .MuiSelect-icon': {
                                                                    color: fieldIcon(namecolor),
                                                                },
                                                            }}
                                                            MenuProps={{
                                                                PaperProps: {
                                                                    style: {
                                                                        backgroundColor: inputfield(namecolor),
                                                                        color: inputfieldtext(namecolor),
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            {stream.map((item) => (
                                                                <MenuItem
                                                                    key={item}
                                                                    value={item}
                                                                    sx={{
                                                                        backgroundColor: inputfield(namecolor),
                                                                        color: inputfieldtext(namecolor),
                                                                        '&:hover': {
                                                                            backgroundColor: inputfieldhover(namecolor),
                                                                        },
                                                                    }}
                                                                >
                                                                    {item}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="row">
                                            <div className="col-md-6 pb-3 form_field_wrapper">
                                                <label className="col-form-label">
                                                    Institute Name<span>*</span>
                                                </label>
                                                <FormControl fullWidth>
                                                    <InputLabel id="institution_id">Institute</InputLabel>
                                                    <Select
                                                        labelId="institution_id"
                                                        id="demo2-multiple-name"
                                                        name="institution_id"
                                                        label="Institute"
                                                        onChange={handleSelect}
                                                        value={teacherData.institution_id}
                                                        sx={{
                                                            backgroundColor: inputfield(namecolor),
                                                            color: inputfieldtext(namecolor),
                                                            '& .MuiSelect-icon': {
                                                                color: fieldIcon(namecolor),
                                                            },
                                                        }}
                                                        MenuProps={{
                                                            PaperProps: {
                                                                style: {
                                                                    backgroundColor: inputfield(namecolor),
                                                                    color: inputfieldtext(namecolor),
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        {institutionsData.map((item) => (
                                                            <MenuItem
                                                                key={item.id}
                                                                value={item.id}
                                                                sx={{
                                                                    backgroundColor: inputfield(namecolor),
                                                                    color: inputfieldtext(namecolor),
                                                                    '&:hover': {
                                                                        backgroundColor: inputfieldhover(namecolor),
                                                                    },
                                                                }}
                                                            >
                                                                {item.institution_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <div className="col-md-6 pb-3 form_field_wrapper">
                                                <label className="col-form-label">
                                                    Course<span>*</span>
                                                </label>
                                                <FormControl fullWidth>
                                                    <InputLabel id="course_id">Course</InputLabel>
                                                    <Select
                                                        id="course_id"
                                                        name="course_id"
                                                        labelId="course_id"
                                                        label="Course"
                                                        onChange={handleSelect}
                                                        value={teacherData.course_id}
                                                    >
                                                        {filteredcoursesData.map((item) => (
                                                            <MenuItem
                                                                key={item.id}
                                                                value={item.id}
                                                                sx={{
                                                                    backgroundColor: inputfield(namecolor),
                                                                    color: inputfieldtext(namecolor),
                                                                    '&:hover': {
                                                                        backgroundColor: inputfieldhover(namecolor),
                                                                    },
                                                                }}
                                                            >
                                                                {item.course_name}
                                                            </MenuItem>
                                                        ))}

                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                    )}
                                    <div className="row">
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                Subjects Taught<span>*</span>
                                            </label>
                                            <FormControl
                                                fullWidth
                                            >
                                                <InputLabel id="demo-multiple-checkbox-label">
                                                    Subject
                                                </InputLabel>
                                                <Select
                                                    labelId="demo-multiple-checkbox-label"
                                                    id="demo-multiple-checkbox"
                                                    multiple
                                                    data-testid="Subject_text"
                                                    sx={{
                                                        backgroundColor: '#f5f5f5',
                                                        '& .MuiSelect-icon': {
                                                            color: fieldIcon(namecolor),
                                                        },
                                                    }}
                                                    value={selectedSubjects}
                                                    onChange={handelSubjectChange}
                                                    input={<OutlinedInput label="Subject" />}
                                                    renderValue={(selected) =>
                                                        (selected as string[])
                                                            .map((id) => {
                                                                const subject = totleSubject.find(
                                                                    (subject: any) => subject.subject_name === id,
                                                                );
                                                                return subject ? subject.subject_name : '';
                                                            })
                                                            // .join(", ")
                                                            .reduce(
                                                                (prev, curr) =>
                                                                    prev === '' ? curr : `${prev}, ${curr}`,
                                                                '',
                                                            )
                                                    }
                                                    MenuProps={MenuProps}
                                                >
                                                    {totleSubject.map((subject: any) => (
                                                        <MenuItem
                                                            key={subject.subject_name}
                                                            value={subject.subject_name}
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
                                                                checked={
                                                                    selectedSubjects.indexOf(
                                                                        subject.subject_id.toString(),
                                                                    ) > -1
                                                                }
                                                            />
                                                            <ListItemText primary={subject.subject_name} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {
                                                    subjects_error && (
                                                        <p className="error-text " style={{ color: 'red' }}>
                                                            <small>Please select at least one subject.</small>
                                                        </p>
                                                    )
                                                }
                                            </FormControl>
                                        </div>
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                Experience<span>*</span>
                                            </label>
                                            <TextField
                                                className="form-control"
                                                value={teacherData.experience}
                                                name="experience"
                                                type="number"
                                                onChange={handleChange}
                                                inputProps={{ min: '0' }}
                                            />
                                            {experience_error === true && (
                                                <p className="error-text " style={{ color: 'red' }}>
                                                    <small>Please enter a valid experience.</small>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row d-flex justify-content-center">
                                        <div className="col-md-6 col-12 mb-3">
                                            <label className={`col-form-label`}>
                                                Country<span>*</span>
                                            </label>
                                            <CountryDropdown
                                                classes="form-select custom-dropdown"
                                                defaultOptionLabel={teacherData.country}
                                                value={teacherData.country || ''}
                                                onChange={(e: string) => handleInputChangecountry(e, 'country')}
                                            />
                                            {country_error === true && (
                                                <p className="error-text " style={{ color: 'red' }}>
                                                    <small>Please select a country.</small>
                                                </p>
                                            )}
                                        </div>

                                        <div className="col-md-6 col-12 mb-3">
                                            <label className="col-form-label">
                                                State<span>*</span>
                                            </label>
                                            <RegionDropdown
                                                data-testid="perStateDropdown"
                                                classes="form-select custom-dropdown"
                                                defaultOptionLabel={teacherData.state || ''}
                                                country={teacherData.country || ''}
                                                value={teacherData.state || ''}
                                                // onChange={(val) => setRegion(val)}
                                                onChange={(e: string) => handleInputChangecountry(e, 'state')}
                                            />
                                            {state_error === true && (
                                                <p className="error-text " style={{ color: 'red' }}>
                                                    <small>Please select a state.</small>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                District<span>*</span>
                                            </label>
                                            <TextField
                                                className="form-control"
                                                value={teacherData.district}
                                                name="district"
                                                onChange={handleChange}
                                            />
                                            {district_error === true && (
                                                <p className="error-text " style={{ color: 'red' }}>
                                                    <small>Please enter a valid district name.</small>
                                                </p>
                                            )}
                                        </div>
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                City<span>*</span>
                                            </label>
                                            <TextField
                                                className="form-control"
                                                value={teacherData.city}
                                                name="city"
                                                onChange={handleChange}
                                            />
                                            {city_error === true && (
                                                <p className="error-text " style={{ color: 'red' }}>
                                                    <small>Please enter a valid city name.</small>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                Address<span>*</span>
                                            </label>
                                            <TextField
                                                className="form-control"
                                                value={teacherData.address}
                                                name="address"
                                                onChange={handleChange}
                                            />
                                            {address_error === true && (
                                                <p className="error-text " style={{ color: 'red' }}>
                                                    <small>Please enter a valid address.</small>
                                                </p>
                                            )}
                                        </div>
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                Pin code<span>*</span>
                                            </label>
                                            <TextField
                                                className="form-control"
                                                value={teacherData.pincode}
                                                name="pincode"
                                                onChange={handleChange}
                                            />
                                            {pincode_error === true && (
                                                <p className="error-text " style={{ color: 'red' }}>
                                                    <small>Please enter a valid pincode.</small>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row">
                                        {selectedEntity === 'School' && (
                                            <div className="col-md-6 pb-3 form_field_wrapper">
                                                <label className="col-form-label">
                                                    Qualifications<span>*</span>
                                                </label>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-multiple-name-label">
                                                        Qualification
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-multiple-name-label"
                                                        id="demo1-multiple-name"
                                                        name="qualification"
                                                        onChange={handleSelect}
                                                        value={teacherData.qualification}
                                                        input={<OutlinedInput label="Qualification" />}
                                                    >
                                                        {qualifications.map((item) => (
                                                            <MenuItem key={item} value={item}>
                                                                {item}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                        )}
                                        <div className="col-md-6 pb-3 form_field_wrapper">
                                            <label className="col-form-label">
                                                Documents <span>*</span>
                                            </label>
                                            <input
                                                type="file"
                                                name="document"
                                                className="form-control"
                                                accept=".pdf, .jpg, .jpeg, .png, .gif"
                                                multiple
                                                onChange={handleFileChange}
                                            />
                                            <List>
                                                {documents.length > 0 ? (
                                                    documents?.map((doc) => (
                                                        <ListItem
                                                            key={doc.name}
                                                            button
                                                            onClick={() => handleDocumentClick(doc.name)}
                                                        >
                                                            <ListItemText primary={doc.name} />
                                                        </ListItem>
                                                    ))
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary" style={{ marginTop: "10px" }}>
                                                        No documents found.
                                                    </Typography>
                                                )}
                                            </List>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="d-flex flex-wrap align-items-center gap-1">
                                                <div className="image-container">
                                                    {!filePreview ? (
                                                        <>

                                                            <div className="image-box">
                                                                <input type="checkbox" className="image-checkbox" />
                                                                <img src={maleImage} alt="male" />
                                                                <span className="check-icon">
                                                                    <CheckCircleOutlinedIcon />
                                                                </span>
                                                            </div>

                                                        </>
                                                    ) : (
                                                        <div className="image-box">
                                                            <img
                                                                src={filePreview}
                                                                alt="Uploaded Preview"
                                                                style={{ marginTop: '10px' }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <label htmlFor="file">
                                                    <div className="upload-profile-image" role="button">
                                                        <UploadOutlinedIcon />
                                                        <input
                                                            data-testid="profile_image"
                                                            type="file"
                                                            id="file"
                                                            name="pic_path"
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            onChange={(e) => {
                                                                handleImageChange(e);
                                                            }}
                                                        />
                                                        Upload Your Picture
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <button type="button" className="btn btn-primary" onClick={handleSubmit}> update</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TeacherProfile;