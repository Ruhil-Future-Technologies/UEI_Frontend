/* eslint-disable @typescript-eslint/no-explicit-any */
import { MRT_ColumnDef } from 'material-react-table';
import { MaybeNull } from '../../types';
import { getDateFormat, isNullOrUndefined } from '../../utils/helpers';
import profile from '../../assets/img/profile_img.svg';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { Switch } from '../Switch/switch';
import useApi from '../../hooks/useAPI';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  QUERY_KEYS,
  // QUERY_KEYS_CLASS,
  QUERY_KEYS_COURSE,
  QUERY_KEYS_DEPARTMENT,
  QUERY_KEYS_ENTITY,
  // QUERY_KEYS_FEEDBACK,
  QUERY_KEYS_FORM,
  QUERY_KEYS_HOBBY,
  QUERY_KEYS_LANGUAGE,
  QUERY_KEYS_MENU,
  QUERY_KEYS_ROLE,
  QUERY_KEYS_ROLEVSADMIN,
  QUERY_KEYS_ROLEVSFORM,
  QUERY_KEYS_SEMESTER,
  QUERY_KEYS_STUDENT,
  // QUERY_KEYS_STUDENT_FEEDBACK,
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL,
  QUERY_KEYS_SUBMENU,
  QUERY_KEYS_UNIVERSITY,
  QUERY_KEYS_TEACHER,
  QUERY_KEYS_CLASS,
  QUERY_KEYS_CONTENT,
} from '../../utils/const';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';

export const EMPTY_CELL_VALUE = '-';

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
export interface TeacherRepoDTO {
  teacher_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  qualification: string;
  role_id: string;
  subjects: string[];
  entity_id: string;
  class_id?: string;
  school_name?: string;
  university_id?: string;
  course_id?: string;
  experience: string | number;
  institution_id: string;
  address: string;
  country: string;
  state: string;
  city: string;
  district: string;
  pincode: string;
  is_active: number;
  is_deleted: boolean;
  is_kyc_verified: boolean | null;
  pic_path: string | null;
  created_at: string;
  updated_at: string;
}
export interface InstituteRep0oDTO {
  institute_name: MaybeNull<string>;
  email: MaybeNull<string>;
  address: MaybeNull<string>;
  city: MaybeNull<string>;
  country: MaybeNull<string>;
  state: MaybeNull<string>;
  district: MaybeNull<string>;
  pincode: MaybeNull<string>;
  entity_id: MaybeNull<string>;
  phone: MaybeNull<string>;
  website_url: MaybeNull<string>;
  id: number;
  university_id?: MaybeNull<string>;
  is_active?: MaybeNull<number>;
  documents?: MaybeNull<File[]>;
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
  institution_id?: MaybeNull<string>;
  duration?: MaybeNull<string>;
  semester_count?: MaybeNull<string>;
  enrollment_status?: MaybeNull<string>;
}
export interface UniversityRep0oDTO {
  university_name: MaybeNull<string>;
  id: number;
  created_at: MaybeNull<string>;
  is_active: number;
  updated_at: MaybeNull<string>;
  icon?: MaybeNull<string>;
  university_id: number;
}
export interface SemesterRep0oDTO {
  semester_name: MaybeNull<string>;
  id: number;
  created_at: MaybeNull<string>;
  is_active: number;
  updated_at: MaybeNull<string>;
  icon?: MaybeNull<string>;
  semester_id: number;
  semester_number?: MaybeNull<string>;
  course_id?: MaybeNull<string>;
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
  semester_number?: MaybeNull<string>;
  id: number;
  course_id: MaybeNull<string>;
  semester_id?: MaybeNull<string>;
  class_id?: MaybeNull<string>;
  class_name?: MaybeNull<string>;
  stream?: MaybeNull<string>;
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
  name?: string;
  first_name: MaybeNull<string>;
  last_name: MaybeNull<string>;
  gender: MaybeNull<string>;
  dob: MaybeNull<string>;
  father_name: MaybeNull<string>;
  mother_name: MaybeNull<string>;
  guardian_name: MaybeNull<string>;
  is_kyc_verified: MaybeNull<boolean>;
  pic_path: MaybeNull<string>;
  id: number | string;
  user_uuid: MaybeNull<string>;
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
  university_id: number;
}
export interface IClass {
  created_at: string;
  class_name: string;
  class_id?: string;
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

export interface ContentRepoDTO {
  id: string;
  url: string;
  content_type: string;
  author: string;
  description: string;
  course_semester_subjects: string;
  class_stream_subjects: string;
  entity_id: string;
  institute_id: string;
  university_id?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Admin {
  id: number;
  department_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  mother_name: string;
  father_name: string;
  dob: Date;
  is_active: boolean;
  user_uuid?: string;
}

export const INSITUTION_COLUMNS = (
  refetch: () => void,
): MRT_ColumnDef<InstituteRep0oDTO>[] => [
  // const columns: any[] = [
  {
    accessorKey: 'institute_name',
    header: 'Institution name ',
    size: 150,
  },
  {
    accessorKey: 'university_name',
    header: 'University name ',
    size: 150,
  },
  {
    accessorKey: 'email',
    header: 'Email ',
    size: 150,
  },

  {
    accessorKey: 'entity_type',
    header: 'Entity ',
    size: 150,
  },
  {
    accessorKey: 'phone',
    header: 'Mobile ',
    size: 150,
  },
  {
    accessorKey: 'website_url',
    header: 'URL',
    size: 180,
    Cell: ({ cell }: any) => {
      const url = cell.getValue();
      return (
        <a
          href={url.startsWith('http') ? url : `http://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#2196F3',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = 'underline';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = 'none';
          }}
        >
          {url}
        </a>
      );
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuInstituteActive = QUERY_KEYS.GET_INSTITUTEACTIVE;
      const MenuInstituteDeactive = QUERY_KEYS.GET_INSTITUTEDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: number, valueset: any) => {
        putData(
          `${valueset ? MenuInstituteDeactive : MenuInstituteActive}/${id}`,
        )
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message, {
                hideProgressBar: true,
                theme: 'colored',
              });
              // window.location.reload();
              refetch();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return row?.original?.is_approve ? (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.user_uuid, Showvalue);
            }}
            // disabled={true}
            activeColor="#4CAF50"
            inactiveColor="#f44336"
          />
        </Box>
      ) : null;
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

export const TEACHER_COLUMNS = (
  refetch: () => void,
): MRT_ColumnDef<TeacherRepoDTO>[] => [
  {
    accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    header: 'Full Name',
    size: 200,
  },
  { accessorKey: 'phone', header: 'Phone', size: 200, minSize: 200 },
  { accessorKey: 'email', header: 'Email', size: 200 },
  {
    accessorKey: 'institute_name',
    header: 'Institute Name',
    size: 200,
  },
  {
    accessorKey: 'university_name',
    header: 'University Name',
    size: 200,
  },
  {
    accessorKey: 'class_name',
    header: 'Class',
    size: 150,
  },
  {
    accessorKey: 'course_name',
    header: 'Course',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/Deactive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const TeacherActive = QUERY_KEYS_TEACHER.TEACHER_ACTIVATE;
      const TeacherDeactive = QUERY_KEYS_TEACHER.TEACHER_DEACTIVATE;
      const value = cell?.getValue();
      const [showValue, setShowValue] = useState(value);
      const [show, setShow] = useState(value ? true : false);
      console.log('is_active called');

      const active = (id: string, valueSet: any) => {
        putData(`${valueSet ? TeacherDeactive : TeacherActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowValue(showValue ? 0 : 1);
              toast.success(data?.message, {
                hideProgressBar: true,
                theme: 'colored',
              });
              refetch();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };
      return row?.original?.is_approve ? (
        <Switch
          isChecked={show}
          onChange={() => active(row?.original?.user_uuid, showValue)}
          label={show ? 'Active' : 'Deactive'}
          activeColor="#4CAF50"
          inactiveColor="#f44336"
        />
      ) : null;
    },
    size: 150,
  },
];

export const Entity_COLUMNS: MRT_ColumnDef<IEntity>[] = [
  // const columns: any[] = [
  {
    accessorKey: 'entity_type',
    header: 'Entity Type ',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated At',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuEntityActive = QUERY_KEYS_ENTITY.GET_ENTITYACTIVE;
      const MenuEntityDeactive = QUERY_KEYS_ENTITY.GET_ENTITYDEACTIVE;
      const value = cell?.getValue();
      const [Showvalue, setShowvalue] = useState(value);
      const [Show, setShow] = useState(Showvalue ? true : false);

      const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      };

      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuEntityDeactive : MenuEntityActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message);
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box style={containerStyle}>
          <Switch
            isChecked={Show}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
            label={Show ? 'Active' : 'Deactive'}
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
    accessorKey: 'class_name',
    header: 'Class Name',
    size: 150,
    Cell: ({ cell }: { cell: any }) => {
      const value = cell?.getValue(); // e.g., "class_01"
      const formatted = value?.replace('class_', 'Class ');
      return <span>{formatted}</span>;
    },
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated At',
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
    accessorKey: 'course_name',
    header: 'Course Name',
    size: 150,
  },
  {
    accessorKey: 'institution_name',
    header: 'Institute Name',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated At',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_COURSE.GET_COURSEACTIVE;
      const MenuDeactive = QUERY_KEYS_COURSE.GET_COURSEDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
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
    accessorKey: 'university_name',
    header: 'University Name',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated At',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITYACTIVE;
      const MenuDeactive = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITYDEACTIVE;
      const value = cell?.getValue();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              // window.location.reload();
              toast.success(data?.message);
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
            onChange={() => {
              active(row?.original?.id, Showvalue);
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
    accessorKey: 'semester_number',
    header: 'Semester',
    size: 150,
  },
  {
    accessorKey: 'institute_name',
    header: 'Institute',
    size: 150,
  },
  {
    accessorKey: 'course_name',
    header: 'Course',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated At',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_SEMESTER.GET_SEMESTERACTIVE;
      const MenuDeactive = QUERY_KEYS_SEMESTER.GET_SEMESTERDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
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
    accessorKey: 'department_name',
    header: 'Department Name ',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created at ',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated at',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_DEPARTMENT.GET_DEPARTMENTACTIVE;
      const MenuDeactive = QUERY_KEYS_DEPARTMENT.GET_DEPARTMENTDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
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

export const STUDENT_COLUMNS: MRT_ColumnDef<any>[] = [
  // const columns: any[] = [
  // {
  //     accessorKey: "aim",
  //     header: "Aim ",
  //     size: 150,
  // },
  {
    accessorKey: 'pic_path',
    header: 'Profile Image',
    size: 150,
    Cell: ({ cell }: any) => {
      const value: any = cell?.getValue();

      if (isNullOrUndefined(value) || value === 0) {
        return EMPTY_CELL_VALUE;
      }

      return (
        <div className="profile_img">
          <img
            src={value !== '' ? value : profile}
            alt="profile"
            height="50px"
            width="50px"
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'first_name',
    header: 'First Name',
    size: 150,
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
    size: 150,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 150,
  },

  {
    accessorKey: 'mobile_no_call',
    header: 'Mobile No',
    size: 150,
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    size: 150,
    Cell: ({ cell }: any) => {
      const value = cell?.getValue() as string | undefined;

      const camelCaseValue = value?.replace(/\b(\w)/g, (match: string) =>
        match?.toUpperCase(),
      );
      return <div>{camelCaseValue}</div>;
    },
  },
  {
    accessorKey: 'dob',
    header: 'DOB',
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
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const StudentActive = QUERY_KEYS_STUDENT.GET_STUDENTACTIVE;
      const StudentDeactive = QUERY_KEYS_STUDENT.GET_STUDENTDEACTIVE;
      const value = cell?.getValue();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);
      const [Show, setShow] = useState(value ? true : false);
      const active = (id: number, valueset: any) => {
        putData(`${valueset ? StudentDeactive : StudentActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message, {
                hideProgressBar: true,
                theme: 'colored',
              });

              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={value ? 'Active' : 'Deactive'}
            onChange={() => {
              active(row?.original?.user_uuid, value);
            }}
          />
        </Box>
      );
    },
    size: 150,
  },
];

export const MENU_COLUMNS: MRT_ColumnDef<MenuRep0oDTO>[] = [
  {
    accessorKey: 'menu_name',
    header: 'Menu Name',
    size: 150,
  },
  {
    accessorKey: 'priority',
    header: 'Menu Sequence',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated at',
    size: 150,
  },

  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_MENU.GET_MENUACTIVE;
      const MenuDeactive = QUERY_KEYS_MENU.GET_MENUDEACTIVE;
      const value = cell?.getValue();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
            onChange={() => {
              active(row?.original?.id, Showvalue);
            }}
          />
        </Box>
      );
    },
    size: 150,
  },
];

export const SUBJECT_COLUMNS: MRT_ColumnDef<SubjectRep0oDTO>[] = [
  {
    accessorKey: 'institute_name',
    header: 'Institute Name',
    size: 150,
  },
  {
    accessorKey: 'course_name',
    header: 'Course Name',
    size: 150,
  },
  {
    accessorKey: 'semester_number',
    header: 'Semester Name',
    size: 150,
  },
  {
    accessorKey: 'subject_name',
    header: 'Subject Name',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated at',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_SUBJECT.GET_SUBJECTACTIVE;
      const MenuDeactive = QUERY_KEYS_SUBJECT.GET_SUBJECTDEACTIVE;
      const value = cell?.getValue();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: any, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
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
    accessorKey: 'class_name',
    header: 'Class Name',
    size: 150,
  },
  {
    accessorKey: 'stream',
    header: 'Stream Name',
    size: 150,
  },
  {
    accessorKey: 'subject_name',
    header: 'Subject Name',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated at',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECTACTIVE;
      const MenuDeactive = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECTDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: any, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
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
    accessorKey: 'language_name',
    header: 'Language Name',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated at',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_LANGUAGE.GET_LANGUAGEACTIVE;
      const MenuDeactive = QUERY_KEYS_LANGUAGE.GET_LANGUAGEDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
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
    accessorKey: 'hobby_name',
    header: 'Hobby Name',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated at',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_HOBBY.GET_HOBBYACTIVE;
      const MenuDeactive = QUERY_KEYS_HOBBY.GET_HOBBYDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
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
    accessorKey: 'question',
    header: 'Question',
    size: 150,
  },
  {
    accessorKey: 'options',
    header: 'Options',
    size: 150,
    Cell: ({ cell }: { cell: any }) => {
      const optionStr = cell.getValue();

      const options = optionStr ? JSON.parse(optionStr) : [];

      return (
        <ul className="table-unordered-list">
          {options?.map((option: string, index: number) => (
            <li key={index} value={option}>
              {option}
            </li>
          ))}
        </ul>
      );
    },
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated at',
    size: 150,
  },
];
export const STUDENT_FEEDBACK_COLUMNS: MRT_ColumnDef<StudentFeedbackRep0oDTO>[] =
  [
    // const columns: any[] = [
    {
      accessorKey: 'student_name',
      header: 'Student Name',
      size: 150,
    },
    {
      accessorKey: 'responses',
      header: 'Responses',
      size: 150,
      enableSorting: false,
      enableColumnActions: false,
      Cell: ({ cell }: any) => {
        const responses: IFeedbackResponse[] = cell.getValue();

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
                    selectedResponse?.map((question: any, qIndex: number) => (
                      <div key={question.id}>
                        {' '}
                        <h4 className="message-bubble m-1">
                          Q.{qIndex + 1} {question?.question}
                        </h4>
                        <div className="row">
                          {/* {question?.options?.length > 0 ? ( */}
                          <div className="col-12 col-md-6 mb-2">
                            <div className="form-check">
                              <p>A. {question?.answer?.answer}</p>
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
      accessorKey: 'created_at',
      header: 'Created At',
      size: 150,
    },
  ];

export const SUBMENU_COLUMNS: MRT_ColumnDef<SubMenuRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: 'sub_menu_name',
    header: 'Submenu Name',
    size: 150,
  },
  {
    accessorKey: 'menu_master_name',
    header: 'Menu Name',
    size: 150,
  },

  {
    accessorKey: 'priority',
    header: 'Menu Sequence',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated at',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_SUBMENU.GET_SUBMENUACTIVE;
      const MenuDeactive = QUERY_KEYS_SUBMENU.GET_SUBMENUDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
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
    accessorKey: 'role_name',
    header: 'Role Name',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated at',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_ROLE.GET_ROLEACTIVE;
      const MenuDeactive = QUERY_KEYS_ROLE.GET_ROLEDEACTIVE;
      const value = cell?.getValue();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
            }
            toast.success(data.message);
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
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

export const FORM_COLUMNS: MRT_ColumnDef<FormRep0oDTO>[] = [
  // const columns: any[] = [
  {
    accessorKey: 'form_name',
    header: 'Form Name',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'menu_master_name',
    header: 'Menu Master',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'sub_menu_master_name',
    header: 'Submenu Master',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'form_url',
    header: 'Form URL',
    size: 150,
    minSize: 150,
    maxSize: 300,
    // enableColumnActions:true,
  },
  {
    accessorKey: 'form_description',
    header: 'Form Description',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'is_menu_visible',
    header: 'Menu Visible',
    size: 150,
    enableResizing: false,
    Cell: ({ cell }: any) => {
      const value = cell?.getValue();
      let visible = '';
      if (value === true) {
        visible = 'Yes';
      } else {
        visible = 'No';
      }
      if (isNullOrUndefined(value) || value === 0) {
        return EMPTY_CELL_VALUE;
      }

      return <div>{visible}</div>;
    },
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated at',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_FORM.GET_FORMACTIVE;
      const MenuDeactive = QUERY_KEYS_FORM.GET_FORMDEACTIVE;
      const value = cell?.getValue();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
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
    accessorKey: 'role_name',
    header: 'Role Master',
    size: 150,
  },
  {
    accessorKey: 'form_name',
    header: 'Form Master',
    size: 150,
  },
  {
    accessorKey: 'is_search',
    header: 'Search',
    size: 150,
    Cell: ({ cell }: any) => {
      const value = cell?.getValue();
      let visible = '';
      if (value === true) {
        visible = 'Yes';
      } else {
        visible = 'No';
      }
      if (isNullOrUndefined(value) || value === 0) {
        return EMPTY_CELL_VALUE;
      }

      return <div>{visible}</div>;
    },
  },
  {
    accessorKey: 'is_save',
    header: 'Save',
    size: 150,
    Cell: ({ cell }: any) => {
      const value = cell?.getValue();
      let visible = '';
      if (value === true) {
        visible = 'Yes';
      } else {
        visible = 'No';
      }
      if (isNullOrUndefined(value) || value === 0) {
        return EMPTY_CELL_VALUE;
      }

      return <div>{visible}</div>;
    },
  },
  {
    accessorKey: 'is_update',
    header: 'Update',
    size: 150,
    Cell: ({ cell }: any) => {
      const value = cell.getValue();
      let visible = '';
      if (value === true) {
        visible = 'Yes';
      } else {
        visible = 'No';
      }
      if (isNullOrUndefined(value) || value === 0) {
        return EMPTY_CELL_VALUE;
      }

      return <div>{visible}</div>;
    },
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated at',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_ROLEVSFORM.GET_ROLEVSFORMACTIVE;
      const MenuDeactive = QUERY_KEYS_ROLEVSFORM.GET_ROLEVSFORMDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message);

              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
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
    accessorKey: 'role_name',
    header: 'Role',
    size: 150,
  },
  {
    accessorKey: 'admin_name',
    header: 'Admin',
    size: 150,
  },
  {
    accessorKey: 'created_by',
    header: 'Created By',
    size: 150,
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
  {
    accessorKey: 'updated_by',
    header: 'Updated By',
    size: 150,
  },
  {
    accessorKey: 'updated_at',
    header: 'Last Updated at',
    size: 150,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_ROLEVSADMIN.GET_ROLEVSADMINACTIVE;
      const MenuDeactive = QUERY_KEYS_ROLEVSADMIN.GET_ROLEVSADMINDEACTIVE;
      const value = cell?.getValue();
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [Showvalue, setShowvalue] = useState(value);

      const [Show, setShow] = useState(value ? true : false);

      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuDeactive : MenuActive}/${id}`)
          .then((data: any) => {
            if (data.status) {
              setShow((prevState) => !prevState);
              setShowvalue(Showvalue ? 0 : 1);

              toast.success(data?.message);
              // window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={Show}
            label={Show ? 'Active' : 'Deactive'}
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
    accessorKey: 'student_name',
    header: 'Student Name',
    size: 150,
  },

  {
    accessorKey: 'chat_title',
    // accessorKey: "chat_question",
    header: 'Chat Question',
    size: 150,
  },

  {
    // accessorKey: "response",
    accessorKey: 'chat_conversation',
    header: 'Response',
    size: 150,
    Cell: ({ cell }: any) => {
      const value = cell?.getValue();
      // console.log("value ------", value);

      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        console.error('Failed to parse value', e);
        return <div>&quot;&quot;</div>;
      }

      const dataset = parsedValue?.map((item: any) => item.answer);
      let flattenedAnswers = dataset?.flat();
      flattenedAnswers = flattenedAnswers
        ?.map((item: any) => {
          if (typeof item === 'string') {
            item = item.replace(/[{}"]/g, '').trim();
            return item.split(',').map((subItem: string) => subItem.trim());
          }
          return item;
        })
        .flat();

      // Join the elements of the 'answer' array into a single coherent string
      const formattedMessage = flattenedAnswers
        ?.filter((word: string) => word !== '') // Remove empty strings
        .join(' ')
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .trim();

      return <div>{formattedMessage || 'No answer available'}</div>;
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 150,
  },
];

export const PDF_LIST_COLUMNS: MRT_ColumnDef<IPDFList>[] = [
  {
    accessorKey: 'pdf_file_name',
    header: 'File Name',
    size: 150,
  },
  {
    accessorKey: 'pdf_path',
    header: 'File Path',
    enableSorting: false,
    enableColumnActions: false,
    size: 150,
  },
  {
    accessorKey: 'upload_date_time',
    header: 'Uploaded At',
    size: 150,
  },
];
export const PDF_LIST_FOR_SCHOOL_COLUMNS: MRT_ColumnDef<IPDFList>[] = [
  {
    accessorKey: 'pdf_file_name',
    header: 'File Name',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'pdf_path',
    header: 'File Path',
    enableSorting: false,
    enableColumnActions: false,
    enableResizing: true,
    size: 160,
    minSize: 130,
    Cell: ({ cell }: { cell: any }) => (
      <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
        {cell?.getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: 'board_name',
    header: 'Board Name',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'state_board_name',
    header: 'State Board Name',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'stream_name',
    header: 'Stream Name',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'class_name',
    header: 'Class Name',
    enableResizing: false,
    size: 150,
    Cell: ({ cell }: { cell: any }) => {
      const value = cell?.getValue(); // e.g., "class_01"
      const formatted = value?.replace('class_', 'Class ');
      return <span>{formatted}</span>;
    },
  },

  {
    accessorKey: 'upload_date_time',
    header: 'Uploaded At',
    size: 150,
    enableResizing: false,
  },
];

export const PDF_LIST_FOR_COLLAGE_COLUMNS: MRT_ColumnDef<IPDFList>[] = [
  {
    accessorKey: 'pdf_file_name',
    header: 'File Name',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'pdf_path',
    header: 'File Path',
    enableSorting: false,
    enableColumnActions: false,
    enableResizing: true,
    size: 160,
    minSize: 130,
    Cell: ({ cell }: { cell: any }) => (
      <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
        {cell?.getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: 'university_name',
    header: 'University Name',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'college_name',
    header: 'Collage Name',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'course_name',
    header: 'Course Name',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'year',
    header: 'Year',
    size: 150,
    enableResizing: false,
  },
  {
    accessorKey: 'upload_date_time',
    header: 'Uploaded At',
    size: 150,
    enableResizing: false,
  },
  {
    id: 'null',
    header: '',
    accessorKey: '',
    size: 20,
    enableResizing: false,
    enableColumnActions: false,
  },
];

export const CONTENT_COLUMNS = (
  refetch: () => void,
): MRT_ColumnDef<ContentRepoDTO>[] => [
  {
    accessorKey: 'url',
    header: 'URL',
    size: 250,
    Cell: ({ cell }: any) => {
      const urls = cell?.getValue();
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {urls.map((item: { id: number; url: string }) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.url}
            </a>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'content_type',
    header: 'Content Type',
    size: 200,
    Cell: ({ cell }: any) => {
      const content_type = cell?.getValue();
      return content_type
        ? content_type.charAt(0).toUpperCase() +
            content_type.slice(1).toLowerCase()
        : null;
    },
  },
  {
    accessorKey: 'author',
    header: 'Author',
    size: 250,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 250,
  },

  {
    accessorKey: 'institute_id',
    header: 'Institute Name',
    size: 200,
    Cell: ({ cell }: any) => {
      const { getData } = useApi();
      const [institute_name, setInstituteName] = useState<string>('-');
      const institute_id = cell.getValue();

      useEffect(() => {
        getData('/institute/list')
          .then((response: any) => {
            if (response.status) {
              const matchingEntity = response.data.find(
                (institute: any) => institute.id === institute_id,
              );

              if (matchingEntity) {
                setInstituteName(matchingEntity.institute_name);
              }
            }
          })
          .catch((error) => {
            toast.error(error?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      }, [institute_id]);

      return <span>{institute_name}</span>;
    },
  },
  {
    accessorKey: 'university_id',
    header: 'University Name',
    size: 200,
    Cell: ({ row }: any) => {
      const { getData } = useApi();
      const [university_name, setUniversityName] = useState('');
      const institute_id = row.original.institute_id;

      useEffect(() => {
        if (institute_id) {
          getData('/institute/list')
            .then((response: any) => {
              if (response.status) {
                const matchingEntity = response.data.find(
                  (institute: any) => institute.id === institute_id,
                );
                if (matchingEntity) {
                  setUniversityName(matchingEntity.university_name);
                }
              }
            })
            .catch((error) => {
              toast.error(error?.message, {
                hideProgressBar: true,
                theme: 'colored',
              });
            });
        }
      }, [institute_id]);

      return <span>{university_name}</span>;
    },
  },
  {
    accessorKey: 'class_id',
    header: 'Class',
    size: 150,
    Cell: ({ row }: any) => {
      const { getData } = useApi();
      const [className, setClassName] = useState<string>('-');
      const [, setClassList] = useState([]);
      const entity_id = row.original.entity_id;
      const class_id = row?.original?.class_stream_subjects
        ? JSON.parse(row?.original?.class_stream_subjects)
        : '';

      useEffect(() => {
        if (entity_id) {
          getData(`${QUERY_KEYS_CLASS.GET_CLASS}`)
            .then((data) => {
              setClassList(data?.data?.classes_data);
              return getData('/entity/list');
            })
            .then((entityResponse: any) => {
              if (entityResponse.status) {
                const entity = entityResponse?.data?.entityes_data.find(
                  (e: any) => e.id === Number(entity_id),
                );

                if (entity?.entity_type === 'school' && class_id) {
                  const class_id_arr = Object.keys(class_id);

                  setClassList((prevClasses) => {
                    const class_name_arr = prevClasses?.filter((cls: any) => {
                      const id = cls.id.toString();

                      return class_id_arr.includes(id);
                    });

                    setClassName(
                      class_name_arr?.map((c: any) => c.class_name).join(', '),
                    );

                    return prevClasses;
                  });
                }
              }
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            });
        }
      }, [entity_id]);

      return <span>{className.replace('class_', 'Class ')}</span>;
    },
  },
  {
    accessorKey: 'course_id',
    header: 'Course',
    size: 150,
    Cell: ({ row }: any) => {
      const { getData } = useApi();
      const [courseName, setCourseName] = useState<string>('-');
      const [, setCourseList] = useState([]);

      const course_id = row?.original?.course_semester_subjects
        ? JSON.parse(row?.original?.course_semester_subjects)
        : '';

      const entity_id = row.original.entity_id;

      useEffect(() => {
        if (entity_id) {
          getData(`${QUERY_KEYS_COURSE.GET_COURSE}`)
            .then((data) => {
              setCourseList(data?.data?.course_data);
              return getData('/entity/list');
            })
            .then((entityResponse: any) => {
              if (entityResponse.status) {
                const entity = entityResponse?.data?.entityes_data.find(
                  (e: any) => e.id === Number(entity_id),
                );

                if (entity?.entity_type === 'college' && course_id) {
                  const course_id_arr = Object.keys(course_id);

                  setCourseList((prevCourses) => {
                    const course_name_arr = prevCourses.filter(
                      (course: any) => {
                        const id = course.id.toString();

                        return course_id_arr.includes(id);
                      },
                    );

                    setCourseName(
                      course_name_arr.map((c: any) => c.course_name).join(', '),
                    );

                    return prevCourses;
                  });
                }
              }
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            });
        }
      }, [entity_id]);

      return <span>{courseName}</span>;
    },
  },
  {
    accessorKey: 'subjects',
    header: 'Subjects',
    size: 250,
    Cell: ({ row }: any) => {
      const [subjectsName, setSubjectsName] = useState<string>('-');

      useEffect(() => {
        const class_id = row?.original?.class_stream_subjects
          ? JSON.parse(row?.original?.class_stream_subjects)
          : '';
        const course_id = row?.original?.course_semester_subjects
          ? JSON.parse(row?.original?.course_semester_subjects)
          : '';

        let subjects: any[] = [];

        if (class_id) {
          subjects = Object.values(class_id)
            .flatMap((category: any) => Object.values(category))
            .flat();
        } else if (course_id) {
          subjects = Object.values(course_id)
            .flatMap((category: any) => Object.values(category))
            .flat();
        }

        setSubjectsName(subjects.length > 0 ? subjects.join(', ') : '-');
      }, [
        row.original.class_stream_subjects,
        row.original.course_semester_subjects,
      ]);

      return <span>{subjectsName}</span>;
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    size: 200,
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated At',
    size: 200,
  },
  {
    accessorKey: 'is_active',
    header: 'Active/DeActive',
    Cell: ({ cell, row, table }: any) => {
      const { putData } = useApi();
      const MenuActive = QUERY_KEYS_CONTENT.GET_CONTENT_ACTIVE;
      const MenuDeactive = QUERY_KEYS_CONTENT.GET_CONTENT_DEACTIVE;
      const value = cell?.getValue();

      const active = async (id: string, currentValue: any) => {
        try {
          const data = await putData(
            `${currentValue ? MenuDeactive : MenuActive}/${id}`,
          );
          if (data.status) {
            table.options.meta?.updateData(
              row.index,
              'is_active',
              currentValue ? 0 : 1,
            );
            toast.success(data?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
            refetch();
          }
        } catch (e: any) {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        }
      };

      return (
        <Switch
          isChecked={!!value}
          onChange={() => active(row?.original?.id, value)}
          label={value ? 'Active' : 'Deactive'}
          activeColor="#4CAF50"
          inactiveColor="#f44336"
        />
      );
    },
    size: 150,
  },
];

export const ADMIN_LIST_COLUMNS: MRT_ColumnDef<Admin>[] = [
  {
    accessorFn: (row) => `${row.first_name ?? ''} ${row.last_name ?? ''}`,
    header: 'Full Name',
    id: 'fullName',
  },
  {
    header: 'Department Name',
    accessorKey: 'department_id',
  },
  {
    header: 'DOB',
    accessorFn: (row) =>
      row.dob ? new Date(row.dob).toLocaleDateString() : '',
  },
  {
    header: 'Gender',
    accessorKey: 'gender',
  },
  {
    header: 'Father Name',
    accessorKey: 'father_name',
  },
  {
    header: 'Mother Name',
    accessorKey: 'mother_name',
  },
  {
    header: 'Active/Deactive',
    accessorKey: 'is_active',
    Cell: ({ cell, row }: any) => {
      const { putData } = useApi();
      const MenuAdminActive = '/admin/activate/';
      const MenuAdminDeactive = '/admin/deactivate/';
      const value = cell?.getValue() ?? false;
      // if (!value) {
      //   return EMPTY_CELL_VALUE;
      // }
      console.log(value);
      const [Showvalue, setShowvalue] = useState(value);
      const active = (id: number, valueset: any) => {
        putData(`${valueset ? MenuAdminDeactive : MenuAdminActive}${id}`)
          .then((data: any) => {
            if (data.status) {
              setShowvalue(Showvalue ? 0 : 1);
              toast.success(data?.message);
              window.location.reload();
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return (
        <Box>
          <Switch
            isChecked={value}
            label={value ? 'Active' : 'Deactive'}
            // onChange={() => setShow((prevState) => !prevState)}
            onChange={() => {
              active(row?.original?.user_uuid, value);
            }}
            // disabled={true}
            activeColor="#4CAF50"
            inactiveColor="#f44336"
          />
        </Box>
      );
    },
  },
];
