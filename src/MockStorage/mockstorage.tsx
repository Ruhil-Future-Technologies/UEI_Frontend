/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '../Pages/AcademicHistory/AcademicHistory';

export const mockStorage: any = {
  menulist1: JSON.stringify([
    {
      created_at: 'Tue, 11 Jun 2024 12:15:27 GMT',
      form_data: {
        form_url: '/main/SuperAdmin',
        is_save: true,
        is_search: true,
        is_update: true,
      },
      id: 23,
      is_active: 1,
      is_deleted: false,
      menu_name: 'Menu',
      priority: 1,
      submenus: [
        {
          created_at: 'Mon, 24 Jun 2024 09:58:08 GMT',
          id: 56,
          is_active: 1,
          is_deleted: false,
          menu_master_id: 23,
          menu_master_name: 'User Authorization',
          menu_name: 'Menu',
          priority: 2,
          updated_at: 'Mon, 24 Jun 2024 13:37:35 GMT',
        },
      ],
      updated_at: 'Fri, 14 Jun 2024 07:40:04 GMT',
    },
    {
      created_at: 'Tue, 11 Jun 2024 12:15:27 GMT',
      form_data: {
        form_url: '/main/SuperAdmin',
        is_save: true,
        is_search: true,
        is_update: true,
      },
      id: 24,
      is_active: 1,
      is_deleted: false,
      menu_name: 'Submenu',
      priority: 1,
      submenus: [
        {
          created_at: 'Mon, 24 Jun 2024 09:58:08 GMT',
          id: 57,
          is_active: 1,
          is_deleted: false,
          menu_master_id: 24,
          menu_master_name: 'User Authorization',
          menu_name: 'Submenu',
          priority: 2,
          updated_at: 'Mon, 24 Jun 2024 13:37:35 GMT',
        },
      ],
      updated_at: 'Fri, 14 Jun 2024 07:40:04 GMT',
    },
  ]),
};

export const contextValue = {
  namepro: { id: 73, user_type: 'admin', userid: 'ashish7080@gmail.com' },
  setNamepro: jest.fn(),
  logoutpro: jest.fn(),
  setProImage: jest.fn(),
  proImage: '',
  setProPercentage: jest.fn(),
  ProPercentage: '',
  setNamecolor: jest.fn(),
  namecolor: '#ffffff',
  activeForm: 0, // Assign a number value, e.g., 0
  setActiveForm: jest.fn(), // Mock function remains unchanged
};

export const mockBoxes: Box[] = [
  {
    id: 334,
    institute_type: 'college',
    board: '',
    state_for_stateboard: '',
    institute_id: '95',
    course_id: 87,
    learning_style: 'online',
    class_id: '24',
    year: '2015-12-31T18:30:00.000Z',
    stream: '',
    university_id: '',
    sem_id: 1,
  },
];

export const mockClassValue = {
  data: [
    {
      class_name: 'class_12',
      created_at: 'Thu, 12 Dec 2024 11:43:04 GMT',
      created_by: 'afasfsafsaf',
      id: '5500819c-09e5-4543-8cf2-8f0d5cf6ffc3',
      is_active: true,
      is_deleted: false,
      updated_at: 'Thu, 12 Dec 2024 11:43:04 GMT',
      updated_by: 'Admin',
    },
  ],
  status: 200,
  message: 'Class Found Successfully',
};

export const mockbasicinfoPayload = {
  payload: [
    {
      student_login_id: '123',
      first_name: 'John',
      last_name: 'Patel',
      gender: 'male',
      dob: '01/01/2024',
      father_name: 'father',
      mother_name: 'mother',
      guardian_name: 'guardian',
      pic_path: 'pic_path',
      aim: 'aim',
    },
  ],
};
