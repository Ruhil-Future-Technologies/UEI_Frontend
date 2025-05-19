export const QUERY_KEYS = {
  GET_INSTITUTES: '/institute/list',
  POST_SIGNUP: '/auth/signup',
  POST_LOGIN: '/auth/login',
  GET_TEACHER: '/teacher/add',
  ENTITY_LIST: '/entity/list',
  INSTITUTE_ADD: '/institute/add',
  INSTITUTE_EDIT: '/institute/edit',
  INSTITUTE_DELETE: '/institutedelete',
  INSTITUTE_DOC_EDIT: '/institute/edit-institute-docs/',
  FORGOT_PASSWORD: '/auth/forgotpassword',
  CHANGE_PASSWORD: '/auth/changepassword',
  RESET_PASSWORD: '/auth/resetpassword',
  CHATADD: '/chat/fetch-from-db',
  CHATRAGMODEL: '/AIchatbot/Bedrock-chat-api',
  // CHATRAGMODEL: 'https://prodllm.gyansetu.ai/rag-model-hierarchy',
  CHATOLLAMA: 'https://prodllm.gyansetu.ai/ollama-chat',
  CHATADDAI: '/chat/generate-from-api',
  CHAT_HISTORY: '/Chatbot/add',
  CHAT_STORE: '/chat/store',
  CHAT_HISTORYCON: '/Chatbot/chat_data_store',
  CHAT_LIST: '/Chatbot/list_based_on_id/student',
  CHAT_LIST_T: '/Chatbot/list_based_on_id/teacher',
  CHATDELETE: '/Chatbot/delete',
  GET_INSTITUTEACTIVE: '/institute/activate',
  GET_INSTITUTEDEACTIVE: '/institute/deactivate',
  CHAT_LISTGETALL: '/Chatbot/getalldata',
  INSITUTE_APPROVE: './institute/approve',
  INSITUTE_DISAPPROVE: './institute/disapprove',
};
export const QUERY_KEYS_STUDENT = {
  GET_STUDENT: '/student/list',
  STUDENT_ADD: '/student/add',
  STUDENT_EDIT: '/student/edit',
  STUDENT_EDIT_BY_ID: '/student/edit',
  STUDENT_GET_BY_LOGIN: '/student/get',
  STUDENT_GET_PROFILE: '/student/getProfile',
  STUDENT_DELETE: '/studentdelete',
  GET_STUDENTACTIVE: '/student/activate',
  GET_STUDENTDEACTIVE: '/student/deactivate',
};
export const QUERY_KEYS_TEACHER = {
  GET_TEACHER: './teacher/list',
  GET_TECHER_BY_UUID: './teacher/edit',
  TEACHER_APPROVE: './teacher/approve',
  TEACHER_DISAPPROVE: './teacher/disapprove',
  TEACHER_ADD: './teacher/add',
  TEACHER_EDIT: '/teacher/edit',
  TEACHER_DELETE: '/teacher/delete',
  TEACHER_ACTIVATE: 'teacher/activate',
  TEACHER_DEACTIVATE: 'teacher/deactivate',
  TEACHER_DOC_EDIT: '/teacher/edit-teacher-docs/',
};
export const QUERY_KEYS_COURSE = {
  GET_COURSE: '/course/list',
  COURSE_ADD: '/course/add',
  COURSE_EDIT: '/course/edit',
  COURSE_DELETE: '/coursedelete',
  GET_COURSEACTIVE: '/course/activate',
  GET_COURSEDEACTIVE: '/course/deactivate',
};
export const QUERY_KEYS_UNIVERSITY = {
  GET_UNIVERSITY: '/university/list',
  UNIVERSITY_ADD: '/university/add',
  UNIVERSITY_GET: '/university/get',
  UNIVERSITY_UPDATE: '/university/update',
  UNIVERSITY_DELETE: '/university/delete',
  GET_UNIVERSITYACTIVE: '/university/activate',
  GET_UNIVERSITYDEACTIVE: '/university/deactivate',
};
export const QUERY_KEYS_SEMESTER = {
  GET_SEMESTER: '/semester/list',
  SEMESTER_ADD: '/semester/add',
  SEMESTER_GET: '/semester/get',
  SEMESTER_UPDATE: '/semester/edit',
  SEMESTER_DELETE: '/semester/delete',
  GET_SEMESTERACTIVE: '/semester/activate',
  GET_SEMESTERDEACTIVE: '/semester/deactivate',
};
export const QUERY_KEYS_ENTITY = {
  GET_ENTITY: '/entity/list',
  GET_ENTITYACTIVE: '/entity/activate',
  GET_ENTITYDEACTIVE: '/entity/deactivate',
  ENTITY_ADD: '/entity/add',
  ENTITY_EDIT: '/entity/edit',
  ENTITY_DELETE: '/entitydelete',
};

export const QUERY_KEYS_CLASS = {
  GET_CLASS: '/class/list',
  CLASS_ADD: '/class/add',
  CLASS_EDIT: '/class/edit',
  CLASS_DELETE: '/class/delete',
  GET_CLASSACTIVE: '/class/activate',
  GET_CLASSDEACTIVE: '/class/deactivate',
  CLASS_GET_EDIT: '/class/get',
};
export const QUERY_KEYS_DEPARTMENT = {
  GET_DEPARTMENT: '/department/list',
  DEPARTMENT_ADD: '/department/add',
  DEPARTMENT_EDIT: '/department/edit',
  DEPARTMENT_DELETE: '/departmentdelete',
  GET_DEPARTMENTACTIVE: '/department/activate',
  GET_DEPARTMENTDEACTIVE: '/department/deactivate',
};

export const QUERY_KEYS_SUBJECT = {
  GET_SUBJECT: '/college_subject/list',
  SUBJECT_ADD: '/college_subject/add',
  SUBJECT_EDIT: '/college_subject/edit',
  SUBJECT_DELETE: '/college_subject/delete',
  GET_SUBJECTACTIVE: '/college_subject/activate',
  GET_SUBJECTDEACTIVE: '/college_subject/deactivate',
  SUBJECT_GET: '/college_subject/get',
};
export const QUERY_KEYS_SUBJECT_SCHOOL = {
  GET_SUBJECT: '/school_subject/list',
  SUBJECT_ADD: '/school_subject/add',
  SUBJECT_EDIT: '/school_subject/edit',
  SUBJECT_GET: '/school_subject/get',
  SUBJECT_DELETE: '/school_subject/delete',
  GET_SUBJECTACTIVE: '/school_subject/activate',
  GET_SUBJECTDEACTIVE: '/school_subject/deactivate',
};
export const QUERY_KEYS_MENU = {
  GET_MENU: '/menu/list',
  MENU_ADD: '/menu/add',
  MENU_EDIT: '/menu/edit',
  MENU_DELETE: '/menudelete',
  GET_MENULIST: '/menu/menu/list_by_admin',
  GET_MENUACTIVE: '/menu/activate',
  GET_MENUDEACTIVE: '/menu/deactivate',
};
export const QUERY_KEYS_SUBMENU = {
  GET_SUBMENU: '/submenu/list',
  SUBMENU_ADD: '/submenu/add',
  SUBMENU_EDIT: '/submenu/edit',
  SUBMENU_DELETE: '/submenudelete',
  GET_MENU: '/menu/list',
  GET_SUBMENUACTIVE: '/submenu/activate',
  GET_SUBMENUDEACTIVE: '/submenu/deactivate',
};

export const QUERY_KEYS_ROLE = {
  GET_ROLE: '/role/list',
  ROLE_ADD: '/role/add',
  ROLE_EDIT: '/role/edit',
  ROLE_DELETE: '/roledelete',
  GET_ROLEACTIVE: '/role/activate',
  GET_ROLEDEACTIVE: '/role/deactivate',
};
export const QUERY_KEYS_FORM = {
  GET_FORM: '/form/list',
  FORM_ADD: '/form/add',
  FORM_EDIT: '/form/edit',
  FORM_DELETE: '/formdelete',
  GET_FORMACTIVE: '/form/activate',
  GET_FORMDEACTIVE: '/form/deactivate',
};
export const QUERY_KEYS_ROLEVSFORM = {
  GET_ROLEVSFORM: '/rolevsform/list',
  ROLEVSFORM_ADD: '/rolevsform/add',
  ROLEVSFORM_EDIT: '/rolevsform/edit',
  ROLEVSFORM_DELETE: '/rolevsformdelete',
  GET_ROLEVSFORMACTIVE: '/rolevsform/activate',
  GET_ROLEVSFORMDEACTIVE: '/rolevsform/deactivate',
};
export const QUERY_KEYS_ROLEVSADMIN = {
  GET_ROLEVSADMIN: '/rolevsadmin/list',
  ROLEVSADMIN_ADD: '/rolevsadmin/add',
  ROLEVSADMIN_EDIT: '/rolevsadmin/edit',
  ROLEVSADMIN_DELETE: '/rolevsadmindelete',
  GET_ROLEVSADMINACTIVE: '/rolevsadmin/activate',
  GET_ROLEVSADMINDEACTIVE: '/rolevsadmin/deactivate',
};
export const QUERY_KEYS_LANGUAGE = {
  GET_LANGUAGE: '/language/list',
  LANGUAGE_ADD: '/language/add',
  LANGUAGE_EDIT: '/language/edit',
  LANGUAGE_DELETE: '/languagedelete',
  GET_LANGUAGEACTIVE: '/language/activate',
  GET_LANGUAGEDEACTIVE: '/language/deactivate',
};
export const QUERY_KEYS_HOBBY = {
  GET_HOBBY: '/hobby/list',
  HOBBY_ADD: '/hobby/add',
  HOBBY_EDIT: '/hobby/edit',
  HOBBY_DELETE: '/hobbydelete',
  GET_HOBBYACTIVE: '/hobby/activate',
  GET_HOBBYDEACTIVE: '/hobby/deactivate',
};
export const QUERY_KEYS_FEEDBACK = {
  GET_FEEDBACK: '/feedback/list',
  GET_BY_ID: '/feedback/',
  FEEDBACK_ADD: '/feedback/add',
  FEEDBACK_EDIT: '/feedback/edit',
  FEEDBACK_DELETE: '/feedback/delete',
  GET_FEEDBACK_ACTIVE: '/feedback/activate',
  GET_FEEDBACK_DEACTIVE: '/feedback/deactivate',
};
export const QUERY_KEYS_STUDENT_FEEDBACK = {
  GET_FEEDBACKS_BY_STUDENT: '/feedback/all_student_feedback',
  GET_FEEDBACK: '/feedback/student_feedback/',
  FEEDBACK_ADD: '/feedback/student_feedback',
  GET_FEEDBACK_ACTIVE: '/feedback/student_activate',
  GET_FEEDBACK_DEACTIVE: '/feedback/student_deactivate',
};
export const QUERY_KEYS_TEACHER_FEEDBACK = {
  GET_FEEDBACKS_BY_TEACHERS: '/feedback/all_teacher_feedback',
  FEEDBACK_ADD: '/feedback/teacher_feedback',
  FEEDBACK_EDIT: '/feedback/teacher_feedback/',
  GET_FEEDBACK_ACTIVE: '/feedback/teacher_activate',
  GET_FEEDBACK_DEACTIVE: '/feedback/teacher_deactivate',
};
export const QUERY_KEYS_ADMIN_BASIC_INFO = {
  GET_ADMIN_BASIC_INFO: '/admin/list',
  ADMIN_ADD_BASIC_INFO: '/admin/add',
  ADMIN_EDIT_BASIC_INFO: '/admin/edit',
  ADMIN_GET_PROFILE: '/admin/getProfile',
  ADMIN_GET_ALLDATA: '/admin/alldata',
};
export const QUERY_KEYS_STUDENT_ADDRESS = {
  GET_ADMIN_STUDENT_ADDRESS: '/student_address/list',
  ADMIN_ADD_STUDENT_ADDRESS: '/student_address/add',
  ADMIN_EDIT_STUDENT_ADDRESS: '/student_address/edit',
};
export const QUERY_KEYS_STUDENT_HOBBY = {
  GET_ADMIN_STUDENT_HOBBY: '/student_hobby/list',
  ADMIN_ADD_STUDENT_HOBBY: '/student_hobby/add',
  ADMIN_EDIT_STUDENT_HOBBY: '/student_hobby/edit',
  GET_STUDENT_HOBBY: 'student_hobby/get',
};
export const QUERY_KEYS_STUDENT_LANGAUGE = {
  GET_ADMIN_STUDENT_LANGAUGE: '/student_language_known/list',
  ADMIN_ADD_STUDENT_LANGAUGE: '/student_language_known/add',
  ADMIN_EDIT_STUDENT_LANGAUGE: '/student_language_known/edit',
};
export const QUERY_KEYS_STUDENT_CONTACT = {
  GET_ADMIN_STUDENT_CONTACT: '/student_contact/list',
  ADMIN_ADD_STUDENT_CONTACT: '/student_contact/add',
  ADMIN_EDIT_STUDENT_CONTACT: '/student_contact/edit',
};
export const QUERY_KEYS_STUDENT_ACADEMIC_HISTORY = {
  GET_ADMIN_STUDENT_ACADEMIC_HISTORY: '/student_academic_history/list',
  ADMIN_ADD_STUDENT_ACADEMIC_HISTORY: '/student_academic_history/add',
  ADMIN_EDIT_STUDENT_ACADEMIC_HISTORY: '/student_academic_history/edit',
  NEW_STUDENT_ACADEMIC_HISTORY: 'new_student_academic_history/get/',
};
export const QUERY_KEYS_STUDENT_SUBJECT_PREFERENCE = {
  GET_ADMIN_STUDENT_SUBJECT_PREFERENCE: '/subject_preference/list',
  ADMIN_ADD_STUDENT_SUBJECT_PREFERENCE: '/subject_preference/add',
  ADMIN_EDIT_STUDENT_SUBJECT_PREFERENCE: '/subject_preference/edit',
};

export const QUERY_KEYS_CONTENT = {
  GET_CONTENT: '/content/list',
  CONTENT_ADD: '/content/add',
  CONTENT_GET: '/content/get',
  CONTENT_EDIT: '/content/edit',
  CONTENT_DELETE: '/content/delete',
  GET_CONTENT_ACTIVE: '/content/activate',
  GET_CONTENT_DEACTIVE: '/content/deactivate',
  CONTENT_FILE_DELETE: '/content/delete/url',
};

export const QUERY_KEYS_QUIZ = {
  GET_QUIZ: '/quiz/get',
  QUIZ_EDIT: '`/quiz/edit',
  GET_SUBMISSION: '/quiz_submission/get/submissions',
  ADD_SUBMISSION: '/quiz_submission/add',
  GET_QUIZ_STUDENT: '/quiz/student',
  GENERATE_QUIZ: '/AIchatbot/generate-quiz',
  GET_QUIZ_BY_TEACHER: '/quiz/get/teacher/',
  DELETE_QUIZ: '/quiz/delete/',
};

export const QUERY_KEYS_ASSIGNMENT = {
  GET_ASSIGNMENT: '/assignment/get/',
  GET_ASSIGNMENTS_LIST: '/assignment/list/',
  DELETE_ASSIGNMENT: '/assignment/delete/',
  ACTIVATE_ASSIGNMENT: '/assignment/activate/',
  DEACTIVATE_ASSIGNMENT: '/assignment/deactivate/',
  EDIT_ASSIGNMENT: '/assignment/edit/',
  ADD_ASSIGNMENT: 'assignment/add',
  GENERATE_AI_ASSIGNMENT: '/AIchatbot/generate-questions',
  ASSIGNMENT_DOC_EDIT: '/assignment/edit-assignment-docs/',
  GET_TOP3: '/assignment/top3-students/',
  STATS_FOR_TEACHER: '/assignment/stats-for-teacher/',
};

export const QUERY_KEYS_ASSIGNMENT_SUBMISSION = {
  GET_STUDENTS_BY_ASSIGNMENT: '/assignment_submission/details/',
  EDIT_ASSIGNMENT_SUBMISSION_FOR_POINTS: '/assignment_submission/edit/',
  GET_ASSIGNMENT_SUBMISSION_BY_STUDENT_ID:
    '/assignment_submission/get/submissions/',
  ADD_ASSIGNMENT_SUBMISSION: '/assignment_submission/add',
  //GENERATE_AI_ASSIGNMENT:'https://prodllm.gyansetu.ai/generate-questions',
};
