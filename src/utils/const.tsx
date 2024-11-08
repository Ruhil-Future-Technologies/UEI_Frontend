export const QUERY_KEYS = {

    GET_INSTITUTES: "/institution/list",
    POST_SIGNUP: "/auth/signup",
    POST_LOGIN: "/auth/login",
    ENTITY_LIST: "/entity/list",
    INSTITUTE_ADD: "/institution/add",
    INSTITUTE_EDIT: "/institution/edit",
    INSTITUTE_DELETE: "/institutiondelete",
    FORGOT_PASSWORD: "/auth/forgotpassword",
    CHANGE_PASSWORD: "/auth/changepassword",
    RESET_PASSWORD: "/auth/resetpassword",
    CHAT: "/chat/chat",

    // CHATADD: "/chat/chatadd",
    // CHATADD: "/chat/chat/fetch-or-generate",
    // CHATADDRAGMODEL: "/rag-model",
    // CHATADDOLLAMA: "/ollama-chat",
    CHATADD: "/chat/fetch-from-db",
    CHATADDRAGMODEL: "http://13.233.157.129:5000/rag-model",
    CHATADDOLLAMA: "http://13.233.157.129:5000/ollama-chat",
    CHATADDAI: "/chat/generate-from-api",
    CHAT_HISTORY:"/Chatbot/add",
    CHAT_STORE:"/chat/store",
    CHAT_HISTORYCON:"/Chatbot/chat_data_store",
    CHAT_LIST:"/Chatbot/list_based_on_id",
    CHATDELETE:"/Chatbot/delete",
    GET_INSTITUTEACTIVE:"/institution/activate",
    GET_INSTITUTEDEACTIVE:"/institution/deactivate",
    CHAT_LISTGETALL:"/Chatbot/getalldata",
    

};
export const QUERY_KEYS_STUDENT = {
    GET_STUDENT: "/student/list",
    STUDENT_ADD: "/student/add",
    STUDENT_EDIT: "/student/edit",
    STUDENT_EDIT_BY_ID: "/student/editstudent",
    STUDENT_GET_BY_LOGIN: "/student/get",
    STUDENT_GET_PROFILE: "/student/getProfile",
    STUDENT_DELETE: "/studentdelete",
    GET_STUDENTACTIVE: "/student/activate",
    GET_STUDENTDEACTIVE: "/student/deactivate",

};
export const QUERY_KEYS_COURSE = {
    GET_COURSE: "/course/list",
    COURSE_ADD: "/course/add",
    COURSE_EDIT: "/course/edit",
    COURSE_DELETE: "/coursedelete",
    GET_COURSEACTIVE: "/course/activate",
    GET_COURSEDEACTIVE: "/course/deactivate",

};
export const QUERY_KEYS_UNIVERSITY = {
    GET_UNIVERSITY: "/university/list",
    UNIVERSITY_ADD: "/university/add",
    UNIVERSITY_GET: "/university/get",
    UNIVERSITY_UPDATE: "/university/update",
    UNIVERSITY_DELETE: "/university/delete",
    GET_UNIVERSITYACTIVE: "/university/activate",
    GET_UNIVERSITYDEACTIVE: "/university/deactivate",
   
};
export const QUERY_KEYS_SEMESTER = {
    GET_SEMESTER: "/semester/list",
    SEMESTER_ADD: "/semester/add",
    SEMESTER_GET: "/semester/get",
    SEMESTER_UPDATE: "/semester/edit",
    SEMESTER_DELETE: "/semester/delete",
    GET_SEMESTERACTIVE: "/semester/activate",
    GET_SEMESTERDEACTIVE: "/semester/deactivate",
   
};
export const QUERY_KEYS_ENTITY = {
    GET_ENTITY: "/entity/list",
    GET_ENTITYACTIVE: "/entity/activate",
    GET_ENTITYDEACTIVE: "/entity/deactivate",
    ENTITY_ADD: "/entity/add",
    ENTITY_EDIT: "/entity/edit",
    ENTITY_DELETE: "/entitydelete",


};

export const QUERY_KEYS_CLASS = {
    GET_CLASS: "/class/list",
    // GET_ENTITYACTIVE: "/entity/activate",
    // GET_ENTITYDEACTIVE: "/entity/deactivate",
    CLASS_ADD: "/class/add",
    CLASS_EDIT: "/class/edit",
    CLASS_DELETE: "/class/delete",
    GET_CLASSACTIVE: "/class/activate",
    GET_CLASSDEACTIVE: "/class/deactivate",
    CLASS_GET_EDIT: "/class/get"



};
export const QUERY_KEYS_DEPARTMENT = {
    GET_DEPARTMENT: "/department/list",
    DEPARTMENT_ADD: "/department/add",
    DEPARTMENT_EDIT: "/department/edit",
    DEPARTMENT_DELETE: "/departmentdelete",
    GET_DEPARTMENTACTIVE: "/department/activate",
    GET_DEPARTMENTDEACTIVE: "/department/deactivate",

};
// export const QUERY_KEYS_SUBJECT = {
//     GET_SUBJECT: "/subject/list",
//     SUBJECT_ADD: "/subject/add",
//     SUBJECT_EDIT: "/subject/edit",
//     SUBJECT_DELETE: "/subjectdelete",
//     GET_SUBJECTACTIVE: "/subject/activate",
//     GET_SUBJECTDEACTIVE: "/subject/deactivate",

// };
export const QUERY_KEYS_SUBJECT = {
    GET_SUBJECT: "/college_subject/list",
    SUBJECT_ADD: "/college_subject/add",
    SUBJECT_EDIT: "/college_subject/edit",
    SUBJECT_DELETE: "/college_subject/delete",
    GET_SUBJECTACTIVE: "/college_subject/activate",
    GET_SUBJECTDEACTIVE: "/college_subject/deactivate",
    SUBJECT_GET: "/college_subject/get",

};
export const QUERY_KEYS_SUBJECT_SCHOOL = {
    GET_SUBJECT: "/school_subject/list",
    SUBJECT_ADD: "/school_subject/add",
    SUBJECT_EDIT: "/school_subject/edit",
    SUBJECT_GET: "/school_subject/get",
    SUBJECT_DELETE: "/school_subject/delete",
    GET_SUBJECTACTIVE: "/school_subject/activate",
    GET_SUBJECTDEACTIVE: "/school_subject/deactivate",

};
export const QUERY_KEYS_MENU = {
    GET_MENU: "/menu/list",
    MENU_ADD: "/menu/add",
    MENU_EDIT: "/menu/edit",
    MENU_DELETE: "/menudelete",
    GET_MENULIST: "/menu/menu/list_by_admin",
    GET_MENUACTIVE: "/menu/activate",
    GET_MENUDEACTIVE: "/menu/deactivate",
    

};
export const QUERY_KEYS_SUBMENU = {
    GET_SUBMENU: "/submenu/list",
    SUBMENU_ADD: "/submenu/add",
    SUBMENU_EDIT: "/submenu/edit",
    SUBMENU_DELETE: "/submenudelete",
    GET_MENU: "/menu/list",
    GET_SUBMENUACTIVE: "/submenu/activate",
    GET_SUBMENUDEACTIVE: "/submenu/deactivate",

};

export const QUERY_KEYS_ROLE = {
    GET_ROLE: "/role/list",
    ROLE_ADD: "/role/add",
    ROLE_EDIT: "/role/edit",
    ROLE_DELETE: "/roledelete",
    GET_ROLEACTIVE: "/role/activate",
    GET_ROLEDEACTIVE: "/role/deactivate",

};
export const QUERY_KEYS_FORM = {
    GET_FORM: "/form/list",
    FORM_ADD: "/form/add",
    FORM_EDIT: "/form/edit",
    FORM_DELETE: "/formdelete",
    GET_FORMACTIVE: "/form/activate",
    GET_FORMDEACTIVE: "/form/deactivate",

};
export const QUERY_KEYS_ROLEVSFORM = {
    GET_ROLEVSFORM: "/rolevsform/list",
    ROLEVSFORM_ADD: "/rolevsform/add",
    ROLEVSFORM_EDIT: "/rolevsform/edit",
    ROLEVSFORM_DELETE: "/rolevsformdelete",
    GET_ROLEVSFORMACTIVE: "/rolevsform/activate",
    GET_ROLEVSFORMDEACTIVE: "/rolevsform/deactivate",

};
export const QUERY_KEYS_ROLEVSADMIN = {
    GET_ROLEVSADMIN: "/rolevsadmin/list",
    ROLEVSADMIN_ADD: "/rolevsadmin/add",
    ROLEVSADMIN_EDIT: "/rolevsadmin/edit",
    ROLEVSADMIN_DELETE: "/rolevsadmindelete",
    GET_ROLEVSADMINACTIVE: "/rolevsadmin/activate",
    GET_ROLEVSADMINDEACTIVE: "/rolevsadmin/deactivate",

};
export const QUERY_KEYS_LANGUAGE = {
    GET_LANGUAGE: "/language/list",
    LANGUAGE_ADD: "/language/add",
    LANGUAGE_EDIT: "/language/edit",
    LANGUAGE_DELETE: "/languagedelete",
    GET_LANGUAGEACTIVE: "/language/activate",
    GET_LANGUAGEDEACTIVE: "/language/deactivate",

};
export const QUERY_KEYS_HOBBY = {
    GET_HOBBY: "/hobby/list",
    HOBBY_ADD: "/hobby/add",
    HOBBY_EDIT: "/hobby/edit",
    HOBBY_DELETE: "/hobbydelete",
    GET_HOBBYACTIVE: "/hobby/activate",
    GET_HOBBYDEACTIVE: "/hobby/deactivate",

};
export const QUERY_KEYS_FEEDBACK = {
    GET_FEEDBACK: "/feedback/list",
    FEEDBACK_ADD: "/feedback/add",
    FEEDBACK_EDIT: "/feedback/edit",
    FEEDBACK_DELETE: "/feedback/delete",
    GET_FEEDBACK_ACTIVE: "/feedback/activate",
    GET_FEEDBACK_DEACTIVE: "/feedback/deactivate",

};
export const QUERY_KEYS_STUDENT_FEEDBACK = {
    GET_FEEDBACK: "/feedback/all_student_feedback",
    FEEDBACK_ADD: "/feedback/student_feedback",
    GET_FEEDBACK_ACTIVE: "/feedback/activate",
    GET_FEEDBACK_DEACTIVE: "/feedback/deactivate",

};
export const QUERY_KEYS_ADMIN_BASIC_INFO = {
    GET_ADMIN_BASIC_INFO: "/admin_basicinfo/list",
    ADMIN_ADD_BASIC_INFO: "/admin_basicinfo/add",
    ADMIN_EDIT_BASIC_INFO: "/admin_basicinfo/edit",
    ADMIN_GET_PROFILE:"/admin_basicinfo/getProfile",

};
export const QUERY_KEYS_STUDENT_ADDRESS = {
    GET_ADMIN_STUDENT_ADDRESS: "/student_address/list",
    ADMIN_ADD_STUDENT_ADDRESS: "/student_address/add",
    ADMIN_EDIT_STUDENT_ADDRESS: "/student_address/edit",
    

};
export const QUERY_KEYS_STUDENT_HOBBY = {
    GET_ADMIN_STUDENT_HOBBY: "/student_hobby/list",
    ADMIN_ADD_STUDENT_HOBBY: "/student_hobby/add",
    ADMIN_EDIT_STUDENT_HOBBY: "/student_hobby/edit",

};
export const QUERY_KEYS_STUDENT_LANGAUGE = {
    GET_ADMIN_STUDENT_LANGAUGE: "/student_language_known/list",
    ADMIN_ADD_STUDENT_LANGAUGE: "/student_language_known/add",
    ADMIN_EDIT_STUDENT_LANGAUGE: "/student_language_known/edit",

};
export const QUERY_KEYS_STUDENT_CONTACT = {
    GET_ADMIN_STUDENT_CONTACT: "/student_contact/list",
    ADMIN_ADD_STUDENT_CONTACT: "/student_contact/add",
    ADMIN_EDIT_STUDENT_CONTACT: "/student_contact/edit",

};
export const QUERY_KEYS_STUDENT_ACADEMIC_HISTORY = {
    GET_ADMIN_STUDENT_ACADEMIC_HISTORY: "/student_academic_history/list",
    ADMIN_ADD_STUDENT_ACADEMIC_HISTORY: "/student_academic_history/add",
    ADMIN_EDIT_STUDENT_ACADEMIC_HISTORY: "/student_academic_history/edit",

};
export const QUERY_KEYS_STUDENT_SUBJECT_PREFERENCE = {
    GET_ADMIN_STUDENT_SUBJECT_PREFERENCE: "/subject_preference/list",
    ADMIN_ADD_STUDENT_SUBJECT_PREFERENCE: "/subject_preference/add",
    ADMIN_EDIT_STUDENT_SUBJECT_PREFERENCE: "/subject_preference/edit",

};
