import { MRT_ColumnDef } from "material-react-table";
import { MaybeNull } from "../../types";
import { getDateFormat, isNullOrUndefined } from "../../utils/helpers";
import profile from "../../assets/img/profile_img.svg";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Switch } from "../Switch/switch";
import useApi from "../../hooks/useAPI";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  QUERY_KEYS,
  QUERY_KEYS_CLASS,
  QUERY_KEYS_COURSE,
  QUERY_KEYS_DEPARTMENT,
  QUERY_KEYS_ENTITY,
  QUERY_KEYS_FEEDBACK,
  QUERY_KEYS_FORM,
  QUERY_KEYS_HOBBY,
  QUERY_KEYS_LANGUAGE,
  QUERY_KEYS_MENU,
  QUERY_KEYS_ROLE,
  QUERY_KEYS_ROLEVSADMIN,
  QUERY_KEYS_ROLEVSFORM,
  QUERY_KEYS_SEMESTER,
  QUERY_KEYS_STUDENT,
  QUERY_KEYS_STUDENT_FEEDBACK,
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL,
  QUERY_KEYS_SUBMENU,
  QUERY_KEYS_UNIVERSITY,
} from "../../utils/const";
import { toast } from "react-toastify";
import { useState } from "react";

export const EMPTY_CELL_VALUE = "-";

export interface SubMenu {
  created_at: string;
  created_by: string;
  id: number;
  is_active: number;
  is_menu_visible: boolean;
  is_save: boolean;
  is_search: boolean;
  is_update: boolean;
  menu_master_id: number;
  menu_master_name: string;
  menu_name: string;
  priority: number;
  updated_at: string;
  updated_by: string;
  url: string;
}

export interface MenuListinter {
  created_at: string;
  created_by: string;
  id: number;
  is_active: number;
  is_save: boolean;
  is_search: boolean;
  is_update: boolean;
  menu_name: string;
  priority: number;
  submenus: SubMenu[];
  updated_at: string;
  updated_by: string;
  url: string;
}
export interface InstituteRep0oDTO {
  institution_name: MaybeNull<string>;
  email_id: MaybeNull<string>;
  address: MaybeNull<string>;
  city: MaybeNull<string>;
  country: MaybeNull<string>;
  state: MaybeNull<string>;
  district: MaybeNull<string>;
  pincode: MaybeNull<string>;
  entity_id: MaybeNull<string>;
  mobile_no: MaybeNull<string>;
  website_url: MaybeNull<string>;
  id: number;
  university_id:MaybeNull<string>;
}
export interface DepartmentRep0oDTO {
  department_name: MaybeNull<string>;
  created_by: MaybeNull<string>;
  created_at: MaybeNull<string>;
  id: number;
}
export interface CourseRep0oDTO {
  course_name: MaybeNull<string>;
  id: number;
  created_at: MaybeNull<string>;
  is_active: number;
  updated_at: MaybeNull<string>;
}
export interface UniversityRep0oDTO {
  university_name: MaybeNull<string>;
  id: number;
  created_at: MaybeNull<string>;
  is_active: number;
  updated_at: MaybeNull<string>;
  icon?: MaybeNull<string>;
  university_id:number;
}
export interface SemesterRep0oDTO {
  semester_name: MaybeNull<string>;
  id: number;
  created_at: MaybeNull<string>;
  is_active: number;
  updated_at: MaybeNull<string>;
  icon?: MaybeNull<string>;
  semester_id:number;
}

export interface FormRep0oDTO {
  form_name: MaybeNull<string>;
  id: number;
  menu_master_id: MaybeNull<string>;
  sub_menu_master_id: MaybeNull<string>;
  form_url: MaybeNull<string>;
  form_description: MaybeNull<string>;
  is_menu_visible: MaybeNull<boolean>;
}
export interface RolevsFormRep0oDTO {
  role_master_id: MaybeNull<string>;
  id: number;
  form_master_id: MaybeNull<string>;
  is_search: MaybeNull<boolean>;
  is_save: MaybeNull<boolean>;
  is_update: MaybeNull<boolean>;
}
export interface ChatListRep0oDTO {
  id: number;
  student_name: MaybeNull<string>;
  question: MaybeNull<string>;
  response: MaybeNull<string>;
}
export interface RolevsAdminRep0oDTO {
  role_master_id: MaybeNull<string>;
  id: number;
  admin_id: MaybeNull<string>;
}
export interface RoleRep0oDTO {
  role_name: MaybeNull<string>;
  priority: MaybeNull<string>;
  id: number;
}
export interface SubjectRep0oDTO {
  subject_id(subject_id: any): unknown;
  subject_name: MaybeNull<string>;
  id: number;
}


export interface LanguageRep0oDTO {
  language_name: MaybeNull<string>;
  id: number;
}
export interface HobbyRep0oDTO {
  created_at: MaybeNull<string>;
  hobby_name: MaybeNull<string>;
  id: number;
  is_active: number;
  updated_at: MaybeNull<string>;
}
export interface FeedbackRep0oDTO {
  created_at: MaybeNull<string>;
  question: MaybeNull<string>;
  options: MaybeNull<string>;
  id: number;
  is_active: number;
  updated_at: MaybeNull<string>;
}
export interface StudentFeedbackRep0oDTO {
  created_at: MaybeNull<string>;
  student_name: MaybeNull<string>;
  responses: IFeedbackResponse[] | MaybeNull<string>;
}
export interface MenuRep0oDTO {
  menu_name: MaybeNull<string>;
  priority: MaybeNull<string>;
  id: number;
}
export interface SubMenuRep0oDTO {
  menu_id: MaybeNull<string>;
  menu_name: MaybeNull<string>;
  priority: MaybeNull<string>;
  id: number;
}
export interface StudentRep0oDTO {
  aim: MaybeNull<string>;
  first_name: MaybeNull<string>;
  last_name: MaybeNull<string>;
  gender: MaybeNull<string>;
  dob: MaybeNull<string>;
  father_name: MaybeNull<string>;
  mother_name: MaybeNull<string>;
  guardian_name: MaybeNull<string>;
  is_kyc_verified: MaybeNull<boolean>;
  pic_path: MaybeNull<string>;
  id: number;
}
export interface IEntity {
  created_at: string;
  entity_type: string;
  id: number;
  is_active: number;
  updated_at: string;
}
export interface IUniversity {
  university_name: MaybeNull<string>;
  id: number;
  created_at: MaybeNull<string>;
  is_active: number;
  updated_at: MaybeNull<string>;
  icon?: MaybeNull<string>;
  university_id:number;
}
export interface IClass {
  created_at: string;
  class_name: string;
  id: number;
  is_active: number;
  updated_at: string;
}
export interface IFeedback {
  created_at: string;
  options: string;
  question: string;
  id: number;
  is_active: number;
  updated_at: string;
}
export interface IStudentFeedback {
  created_at: string;
  student_name: string;
  responses: IFeedbackResponse[];
  is_active: number;
}
export interface IFeedbackResponse {
  answer: string;
  id: number;
  question: string;
}
export interface IPDFList {
  pdf_id: string;
  pdf_file_name: string;
  pdf_path: string;
  upload_date_time: string;
}
export const INSITUTION_COLUMNS: MRT_ColumnDef<InstituteRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "institution_name",
    header: "Institute name ",
    size: 150,
  },
  {
    accessorKey: "university_name",
    header: "University name ",
    size: 150,
  },
  {
    accessorKey: "email_id",
    header: "Email ",
    size: 150,
  },
  {
    accessorKey: "address",
    header: "Address",
    size: 150,
  },
  {
    accessorKey: "city",
    header: "City ",
    size: 150,
  },
  {
    accessorKey: "country",
    header: "Country",
    size: 150,
  },
  {
    accessorKey: "state",
    header: "State ",
    size: 150,
  },
  {
    accessorKey: "district",
    header: "District ",
    size: 150,
  },
  {
    accessorKey: "pincode",
    header: "Pincode",
    size: 150,
  },
  {
    accessorKey: "entity_id",
    header: "Entity ",
    size: 150,
  },
  {
    accessorKey: "mobile_no",
    header: "Mobile ",
    size: 150,
  },
  {
    accessorKey: "website_url",
    header: "URL ",
    size: 180,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated At",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuInstituteActive = QUERY_KEYS.GET_INSTITUTEACTIVE;
      const MenuInstituteDeactive = QUERY_KEYS.GET_INSTITUTEDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(
          `${
            valueset === 1 ? MenuInstituteDeactive : MenuInstituteActive
          }/${id}`
        )
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },

  //      {
  //     id:"null",
  //     header: "",
  //     accessorKey: "",
  //     size: 20,
  //     enableResizing:false,
  //     enableColumnActions:false,
  //   },
];

export const Entity_COLUMNS: MRT_ColumnDef<IEntity>[] = [
  // const columns: any[] = [
  {
    accessorKey: "entity_type",
    header: "Entity Type ",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated At",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuEntityActive = QUERY_KEYS_ENTITY.GET_ENTITYACTIVE;
      const MenuEntityDeactive = QUERY_KEYS_ENTITY.GET_ENTITYDEACTIVE;
      // console.log("active data",row.original.id)
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(Showvalue === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(
          `${valueset === 1 ? MenuEntityDeactive : MenuEntityActive}/${id}`
        )
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },
];

export const Class_COLUMNS: MRT_ColumnDef<IClass>[] = [
  // const columns: any[] = [
  {
    accessorKey: "class_name",
    header: "Class name ",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated At",
    size: 150,
  },
  // {
  //   accessorKey: "is_active",
  //   header: "Active/DeActive",
  //   Cell: ({ cell,row }) => {

  //     const { putData } = useApi()
  //     const MenuClassActive = QUERY_KEYS_CLASS.GET_CLASSACTIVE;
  //     const MenuClassDeactive = QUERY_KEYS_CLASS.GET_CLASSDEACTIVE;
  //     const value = cell?.getValue();
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const [Showvalue, setShowvalue]=useState(value)
  //     // eslint-disable-next-line react-hooks/rules-of-hooks
  //     const [Show, setShow]=useState(Showvalue === 1 ? true : false)

  //     const active = (id: number,valueset:any)=>{
  //       putData(`${valueset === 1 ? MenuClassDeactive : MenuClassActive}/${id}`).then((data: any) => {

  //         if (data.status === 200) {
  //           setShow((prevState) => !prevState)
  //           setShowvalue(Showvalue === 1 ? 0 : 1)
  //           // window.location.reload();
  //         }
  //     }).catch(e => {
  //         toast.error(e?.message, {
  //             hideProgressBar: true,
  //             theme: "colored",
  //         });
  //     });
  //     }

  //     return (

  //       <Box>
  //         <Switch
  //           isChecked={Show}
  //           label={Show ? "Active": "Deactive"}
  //           // onChange={() => setShow((prevState) => !prevState)}
  //           onChange={()=>{active(row?.original?.id,Showvalue)} }
  //           // disabled={true}
  //         />
  //       </Box>

  //     );
  //   },
  //   size: 150,
  // },
];

export const COURSE_COLUMNS: MRT_ColumnDef<CourseRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "course_name",
    header: "Course Name",
    size: 150,
  },
  {
    accessorKey: "institution_name",
    header: "Institute Name",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated At",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_COURSE.GET_COURSEACTIVE;
      const MenuDeactive = QUERY_KEYS_COURSE.GET_COURSEDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },
];
export const UNIVERSITY_COLUMNS: MRT_ColumnDef<UniversityRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "university_name",
    header: "University Name",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated At",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITYACTIVE;
      const MenuDeactive = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITYDEACTIVE;
      const value = cell?.getValue();
    
console.log("====lll",row)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
           
            onChange={() => {
              active(row?.original?.university_id, Showvalue);
            }}
            
          />
        </Box>
      );
    },
    size: 150,
  },
];
export const SEMESTER_COLUMNS: MRT_ColumnDef<SemesterRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "semester_number",
    header: "Semester",
    size: 150,
  },
  {
    accessorKey: "institution_name",
    header: "Institute",
    size: 150,
  },
  {
    accessorKey: "course_name",
    header: "Course",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated At",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_SEMESTER.GET_SEMESTERACTIVE;
      const MenuDeactive = QUERY_KEYS_SEMESTER.GET_SEMESTERDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.semester_id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },

];
export const Department_COLUMNS: MRT_ColumnDef<DepartmentRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "department_name",
    header: "Department Name ",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created at ",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated at",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_DEPARTMENT.GET_DEPARTMENTACTIVE;
      const MenuDeactive = QUERY_KEYS_DEPARTMENT.GET_DEPARTMENTDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },
];

export const STUDENT_COLUMNS: MRT_ColumnDef<StudentRep0oDTO>[] = [
  // const columns: any[] = [
  // {
  //     accessorKey: "aim",
  //     header: "Aim ",
  //     size: 150,
  // },
  {
    accessorKey: "pic_path",
    header: "Profile Image",
    size: 150,
    Cell: ({ cell }) => {
      const value: any = cell?.getValue();

      if (isNullOrUndefined(value) || value === 0) {
        return EMPTY_CELL_VALUE;
      }

      return (
        <div className="profile_img">
          <img
            src={value !== "" ? value : profile}
            alt="profile"
            height="50px"
            width="50px"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "first_name",
    header: "First Name",
    size: 150,
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    size: 150,
  },
  {
    accessorKey: "email_id",
    header: "Email",
    size: 150,
  },

  {
    accessorKey: "mobile_no_call",
    header: "Mobile No",
    size: 150,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    size: 150,
    Cell: ({ cell }) => {
      const value = cell?.getValue() as string | undefined;

      const camelCaseValue = value?.replace(/\b(\w)/g, (match: string) =>
        match?.toUpperCase()
      );
      return <div>{camelCaseValue}</div>;
    },
  },
  {
    accessorKey: "dob",
    header: "DOB",
    size: 150,
    Cell: ({ cell }) => {
      const value = cell.getValue();

      if (isNullOrUndefined(value) || value === 0) {
        return EMPTY_CELL_VALUE;
      }

      return getDateFormat(value);
    },
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const StudentActive = QUERY_KEYS_STUDENT.GET_STUDENTACTIVE;
      const StudentDeactive = QUERY_KEYS_STUDENT.GET_STUDENTDEACTIVE;
      // console.log(StudentActive,StudentDeactive)
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset === 1 ? StudentDeactive : StudentActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },
  // {
  //     accessorKey: "father_name",
  //     header: "Father Name",
  //     size: 150,
  // },
  // {
  //     accessorKey: "mother_name",
  //     header: "Mother Name",
  //     size: 150,
  // },
  // {
  //     accessorKey: "guardian_name",
  //     header: "Guardian Name",
  //     size: 150,
  // },
];

export const MENU_COLUMNS: MRT_ColumnDef<MenuRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "menu_name",
    header: "Menu Name",
    size: 150,
  },
  {
    accessorKey: "priority",
    header: "Menu Sequence",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated at",
    size: 150,
  },

  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_MENU.GET_MENUACTIVE;
      const MenuDeactive = QUERY_KEYS_MENU.GET_MENUDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },
];

export const SUBJECT_COLUMNS: MRT_ColumnDef<SubjectRep0oDTO>[] = [
  // const columns: any[] = [
    {
      accessorKey: "institute_name",
      header: "Institute Name",
      size: 150,
    },
    {
      accessorKey: "course_name",
      header: "Course Name",
      size: 150,
    },
    {
      accessorKey: "semester_id",
      header: "Semester Name",
      size: 150,
    },
  {
    accessorKey: "subject_name",
    header: "Subject Name",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated at",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_SUBJECT.GET_SUBJECTACTIVE;
      const MenuDeactive = QUERY_KEYS_SUBJECT.GET_SUBJECTDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: any, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.subject_id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },
];
export const SUBJECT_COLUMNS_SCHOOL: MRT_ColumnDef<SubjectRep0oDTO>[] = [
  // const columns: any[] = [
    {
      accessorKey: "class_name",
      header: "Class Name",
      size: 150,
    },
    {
      accessorKey: "stream",
      header: "Stream Name",
      size: 150,
    },
  {
    accessorKey: "subject_name",
    header: "Subject Name",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated at",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECTACTIVE;
      const MenuDeactive = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECTDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: any, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.subject_id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },
];
export const LANGUAGE_COLUMNS: MRT_ColumnDef<LanguageRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "language_name",
    header: "Language Name",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated at",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_LANGUAGE.GET_LANGUAGEACTIVE;
      const MenuDeactive = QUERY_KEYS_LANGUAGE.GET_LANGUAGEDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },
];
export const HOBBY_COLUMNS: MRT_ColumnDef<HobbyRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "hobby_name",
    header: "Hobby Name",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated at",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_HOBBY.GET_HOBBYACTIVE;
      const MenuDeactive = QUERY_KEYS_HOBBY.GET_HOBBYDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },
];
export const FEEDBACK_COLUMNS: MRT_ColumnDef<FeedbackRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "question",
    header: "Question",
    size: 150,
  },
  {
    accessorKey: "options",
    header: "Options",
    size: 150,
    Cell: ({ cell }: { cell: any }) => {
      const options = cell.getValue();
      return (
        <ul className="table-unordered-list">
          {options.map((option: string, index: number) => (
            <li key={index} value={option}>
              {option}
            </li>
          ))}
        </ul>
      );
    },
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated at",
    size: 150,
  },
  // {
  //   accessorKey: "is_active",
  //   header: "Active/DeActive",
  //   Cell: ({ cell, row }) => {
  //     const { putData } = useApi();
  //     const MenuActive = QUERY_KEYS_FEEDBACK.GET_FEEDBACK_ACTIVE;
  //     const MenuDeactive = QUERY_KEYS_FEEDBACK.GET_FEEDBACK_DEACTIVE;
  //     const value = cell?.getValue();
  //     // if (!value) {
  //     //   return EMPTY_CELL_VALUE;
  //     // }

  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const [Showvalue, setShowvalue] = useState(value);
  //     // eslint-disable-next-line react-hooks/rules-of-hooks
  //     const [Show, setShow] = useState(value === 1 ? true : false);

  //     const active = (id: number, valueset: any) => {
  //       putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
  //         .then((data: any) => {
  //           if (data.status === 200) {
  //             setShow((prevState) => !prevState);
  //             setShowvalue(Showvalue === 1 ? 0 : 1);
  //             // window.location.reload();
  //           }
  //         })
  //         .catch((e) => {
  //           toast.error(e?.message, {
  //             hideProgressBar: true,
  //             theme: "colored",
  //           });
  //         });
  //     };

  //     return (
  //       <Box>
  //         <Switch
  //           isChecked={Show}
  //           label={Show ? "Active" : "Deactive"}
  //           // onChange={() => setShow((prevState) => !prevState)}
  //           onChange={() => {
  //             active(row?.original?.id, Showvalue);
  //           }}
  //           // disabled={true}
  //         />
  //       </Box>
  //     );
  //   },
  //   size: 150,
  // },
];
export const STUDENT_FEEDBACK_COLUMNS: MRT_ColumnDef<StudentFeedbackRep0oDTO>[] =
  [
    // const columns: any[] = [
    {
      accessorKey: "student_name",
      header: "Student Name",
      size: 150,
    },
    {
      accessorKey: "responses",
      header: "Responses",
      size: 150,
      enableSorting: false,
      enableColumnActions: false,
      Cell: ({ cell }) => {
        const responses: IFeedbackResponse[] =
          cell.getValue<IFeedbackResponse[]>();

        // State for modal
        const [open, setOpen] = useState(false);
        const [selectedResponse, setSelectedResponse] = useState<
          IFeedbackResponse[] | null
        >(null);

        // Function to handle eye icon click
        const handleIconClick = (response: IFeedbackResponse[]) => {
          setSelectedResponse(response);
          setOpen(true);
        };

        // Function to close the modal
        const handleClose = () => {
          setOpen(false);
          setSelectedResponse(null);
        };

        return (
          <div>
            <IconButton
              onClick={() => handleIconClick(responses)}
              aria-label="view response"
            >
              <VisibilityIcon />
            </IconButton>

            {/* Modal component */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Response Details</DialogTitle>
              <DialogContent>
                <div className="feedback-view">
                  {selectedResponse &&
                    selectedResponse.map((question: any, qIndex: number) => (
                      <div key={question.id}>
                        {" "}
                        <h4 className="message-bubble m-1">
                          Q.{qIndex + 1} {question.question}
                        </h4>
                        <div className="row">
                          {/* {question?.options?.length > 0 ? ( */}
                          <div className="col-12 col-md-6 mb-2">
                            <div className="form-check">
                              <p>A. {question.answer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      },
    },

    {
      accessorKey: "created_at",
      header: "Created At",
      size: 150,
    },
  ];

export const SUBMENU_COLUMNS: MRT_ColumnDef<SubMenuRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "menu_name",
    header: "Submenu Name",
    size: 150,
  },
  {
    accessorKey: "menu_master_name",
    header: "Menu Name",
    size: 150,
  },

  {
    accessorKey: "priority",
    header: "Menu Sequence",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated at",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_SUBMENU.GET_SUBMENUACTIVE;
      const MenuDeactive = QUERY_KEYS_SUBMENU.GET_SUBMENUDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },
];

export const ROLE_COLUMNS: MRT_ColumnDef<RoleRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "role_name",
    header: "Role Name",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated at",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_ROLE.GET_ROLEACTIVE;
      const MenuDeactive = QUERY_KEYS_ROLE.GET_ROLEDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },
  //   {
  //     accessorKey: "priority",
  //     header: "Priority",
  //     size: 150,
  // }
];

export const FORM_COLUMNS: MRT_ColumnDef<FormRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "form_name",
    header: "Form Name",
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: "menu_master_name",
    header: "Menu Master",
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: "sub_menu_master_name",
    header: "Submenu Master",
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: "form_url",
    header: "Form URL",
    size: 150,
    minSize: 150,
    maxSize: 300,
    // enableColumnActions:true,
  },
  {
    accessorKey: "form_description",
    header: "Form Description",
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: "is_menu_visible",
    header: "Menu Visible",
    size: 150,
    enableResizing: false,
    Cell: ({ cell }) => {
      const value = cell?.getValue();
      let visible = "";
      if (value === true) {
        visible = "Yes";
      } else {
        visible = "No";
      }
      if (isNullOrUndefined(value) || value === 0) {
        return EMPTY_CELL_VALUE;
      }

      return <div>{visible}</div>;
    },
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated at",
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_FORM.GET_FORMACTIVE;
      const MenuDeactive = QUERY_KEYS_FORM.GET_FORMDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
    enableResizing: false,
  },
];

export const ROLEVSFORM_COLUMNS: MRT_ColumnDef<RolevsFormRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "role_name",
    header: "Role Master",
    size: 150,
  },
  {
    accessorKey: "form_name",
    header: "Form Master",
    size: 150,
  },
  {
    accessorKey: "is_search",
    header: "Search",
    size: 150,
    Cell: ({ cell }) => {
      const value = cell?.getValue();
      let visible = "";
      if (value === true) {
        visible = "Yes";
      } else {
        visible = "No";
      }
      if (isNullOrUndefined(value) || value === 0) {
        return EMPTY_CELL_VALUE;
      }

      return <div>{visible}</div>;
    },
  },
  {
    accessorKey: "is_save",
    header: "Save",
    size: 150,
    Cell: ({ cell }) => {
      const value = cell?.getValue();
      let visible = "";
      if (value === true) {
        visible = "Yes";
      } else {
        visible = "No";
      }
      if (isNullOrUndefined(value) || value === 0) {
        return EMPTY_CELL_VALUE;
      }

      return <div>{visible}</div>;
    },
  },
  {
    accessorKey: "is_update",
    header: "Update",
    size: 150,
    Cell: ({ cell }) => {
      const value = cell.getValue();
      let visible = "";
      if (value === true) {
        visible = "Yes";
      } else {
        visible = "No";
      }
      if (isNullOrUndefined(value) || value === 0) {
        return EMPTY_CELL_VALUE;
      }

      return <div>{visible}</div>;
    },
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated at",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_ROLEVSFORM.GET_ROLEVSFORMACTIVE;
      const MenuDeactive = QUERY_KEYS_ROLEVSFORM.GET_ROLEVSFORMDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },
];
export const ROLEVSADMIN_COLUMNS: MRT_ColumnDef<RolevsFormRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "role_name",
    header: "Role",
    size: 150,
  },
  {
    accessorKey: "admin_name",
    header: "Admin",
    size: 150,
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    size: 150,
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    size: 150,
  },
  {
    accessorKey: "updated_at",
    header: "Last Updated at",
    size: 150,
  },
  {
    accessorKey: "is_active",
    header: "Active/DeActive",
    Cell: ({ cell, row }) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_ROLEVSADMIN.GET_ROLEVSADMINACTIVE;
      const MenuDeactive = QUERY_KEYS_ROLEVSADMIN.GET_ROLEVSADMINDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [Show, setShow] = useState(value === 1 ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset === 1 ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status === 200) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue === 1 ? 0 : 1);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? "Active" : "Deactive"}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            // disabled={true}
          />
        </Box>
      );
    },
    size: 150,
  },
];

export const CHATLIST_COLUMNS: MRT_ColumnDef<ChatListRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: "student_name",
    header: "Student Name",
    size: 150,
  },

  {
    accessorKey: "chat_title",
    // accessorKey: "chat_question",
    header: "Chat Question",
    size: 150,
  },
  //  {
  //   // accessorKey: "response",
  //   accessorKey: "chat_conversation",
  //   header: "Response",
  //   size: 150,
  //   Cell: ({ cell }:any) => {
  //     const value = cell?.getValue();

  //   console.log("value ------", value);
  //   let cleanedString = value?.replace(/\\"/g, '');

  // // Step 2: Remove the curly braces
  // cleanedString = cleanedString?.replace(/{|}/g, '');

  // // Step 3: Remove any leading or trailing spaces around commas
  // cleanedString = cleanedString?.replace(/\s*,\s*/g, ',');
  // cleanedString = cleanedString?.slice(1, -1);

  // // Step 4: Split the string by commas and then join with spaces for proper formatting
  // const formattedMessage = cleanedString?.split(',').join(' ');
  // // const words = cleanedString.split(',').map((word:any) => word.trim());
  // // const formattedMessage = words.join(' ');

  //     return (
  //       <div>
  //         {formattedMessage}
  //       </div>

  //     )
  //   },
  // },

  {
    // accessorKey: "response",
    accessorKey: "chat_conversation",
    header: "Response",
    size: 150,
    Cell: ({ cell }: any) => {
      const value = cell?.getValue();
      // console.log("value ------", value);

      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        console.error("Failed to parse value", e);
        return <div>""</div>;
      }

      // Extract the 'answer' arrays
      let dataset = parsedValue?.map((item: any) => item.answer);
      // console.log("dataset ------", dataset);

      // Flatten the dataset array (if it contains multiple arrays)
      let flattenedAnswers = dataset?.flat();

      // Handle cases where dataset contains improperly formatted strings
      flattenedAnswers = flattenedAnswers
        ?.map((item: any) => {
          if (typeof item === "string") {
            // Remove unnecessary characters and split the string if needed
            item = item.replace(/[{}"]/g, "").trim();
            return item.split(",").map((subItem: string) => subItem.trim());
          }
          return item;
        })
        .flat();

      // Join the elements of the 'answer' array into a single coherent string
      const formattedMessage = flattenedAnswers
        ?.filter((word: string) => word !== "") // Remove empty strings
        .join(" ")
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .trim();

      return <div>{formattedMessage || "No answer available"}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
  },
];

export const PDF_LIST_COLUMNS: MRT_ColumnDef<IPDFList>[] = [
  {
    accessorKey: "pdf_file_name",
    header: "File Name",
    size: 150,
  },
  {
    accessorKey: "pdf_path",
    header: "File Path",
    enableSorting: false,
    enableColumnActions:false,
    size: 150,
  },
  {
    accessorKey: "upload_date_time",
    header: "Uploaded At",
    size: 150,
  }
]
