import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AddEditCourse from '../AddEditCourse'; // Adjust the import as needed
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import useApi from '../../../hooks/useAPI';
import { QUERY_KEYS } from '../../../utils/const';
import NameContext from '../../Context/NameContext';
import { contextValue } from '../../../MockStorage/mockstorage';
// import { toast } from 'react-toastify';

// Mock necessary functions
jest.mock('../../../utils/const');
// jest.mock('../../../hooks/useAPI', () => ({
//     __esModule: true,
//     default: jest.fn(),
//   }));
  jest.mock('../../../hooks/useAPI', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
      getData: jest.fn(),
      postData: jest.fn(),
      putData: jest.fn(),
    }),
  }));
  
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
  }));

describe('AddEditCourse Component', () => {

  const mockGetData = jest.fn();
  const mockPostData = jest.fn();
  const mockPutData = jest.fn();

  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue({
      getData: mockGetData,
      postData: mockPostData,
      putData: mockPutData,
    });
      (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockGetData.mockResolvedValue({ data: [] }); // Default mock data
    mockPostData.mockResolvedValue({ status: 200, message: 'Course created successfully' });
    mockPutData.mockResolvedValue({ status: 200, message: 'Course updated successfully' });

  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  const renderRoleComponent = () => {
    return render(
      <NameContext.Provider value={contextValue}>
        <Router>
        <AddEditCourse />
        </Router>
      </NameContext.Provider>,
    );
  };
  it('renders the Add/Edit Course form', () => {
    const {getByTestId } = renderRoleComponent();
    const institute = getByTestId('institute');
    const course_name = getByTestId('course_name');
    const duration = getByTestId('duration');
    const btnsave = getByTestId('btn-save');
    expect(institute).toBeInTheDocument();
    expect(course_name).toBeInTheDocument();
    expect(duration).toBeInTheDocument();
    expect(btnsave).toBeInTheDocument();
  });

  it('fetches the institute list on mount', async () => {
      renderRoleComponent();

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledWith(QUERY_KEYS.GET_INSTITUTES);
    });
  });

  it('displays validation errors if required fields are empty', async () => {
    const {findByText,getByTestId } = renderRoleComponent();
    const btnsave = getByTestId('btn-save');
    fireEvent.click(btnsave);

    expect(await findByText(/Please enter course name/)).toBeInTheDocument();
    expect(await findByText(/Please select institute name/)).toBeInTheDocument();
    expect(await findByText(/Please select duration/)).toBeInTheDocument();
  });

//   it('submits the form data successfully for adding a course', async () => {
//     mockPostData.mockResolvedValue({
//         status: 200,
//         message: 'Course created successfully',
//       });
//     const { getByTestId } = renderRoleComponent();

//     const courseNameInput = getByTestId('institute').querySelector(
//         'input',
//       ) as HTMLInputElement;;
//     const instituteSelect = getByTestId('course_name').querySelector(
//         'input',
//       ) as HTMLInputElement;;
//     const durationSelect = getByTestId('duration').querySelector(
//         'input',
//       ) as HTMLInputElement;;

//     fireEvent.change(courseNameInput, { target: { value: 'Test Course' } });
//     fireEvent.change(instituteSelect, { target: { value: '1' } });
//     fireEvent.change(durationSelect, { target: { value: '2' } });

//     const btnsave = getByTestId('btn-save');
//     fireEvent.click(btnsave);

//     await waitFor(() => {
//       expect(mockPostData).toHaveBeenCalledWith(QUERY_KEYS_COURSE.COURSE_ADD, {
//         course_name: 'Test Course',
//         institution_id: '1',
//         duration: '2',
//       });
//     });
//       await waitFor(() => {
//         expect(toast.success).toHaveBeenCalledWith(
//           'Course created successfully',
//           expect.any(Object)
//         );
//       });
//   });

//   it('submits the form data successfully for editing a course', async () => {
//     // Mock data for editing
//     mockGetData.mockResolvedValueOnce({ data: { course_name: 'Test Course', institution_id: '1', duration: '2' } });

//     const { getByText,getByTestId } = renderRoleComponent();

 
//     const courseNameInput = getByTestId('institute').querySelector(
//         'input',
//       ) as HTMLInputElement;
//     const instituteSelect = getByTestId('course_name').querySelector(
//         'input',
//       ) as HTMLInputElement;
//     const durationSelect = getByTestId('duration').querySelector(
//         'input',
//       ) as HTMLInputElement;

//     fireEvent.change(courseNameInput, { target: { value: 'Updated Course' } });
//     fireEvent.change(instituteSelect, { target: { value: '2' } });
//     fireEvent.change(durationSelect, { target: { value: '3' } });

//     const btnsave = getByTestId('btn-save');
//     fireEvent.click(btnsave);

//     await waitFor(() => {
//       expect(mockPutData).toHaveBeenCalledWith(`${QUERY_KEYS_COURSE.COURSE_EDIT}/1`, {
//         course_name: 'Updated Course',
//         institution_id: '2',
//         duration: '3',
//       });
//     });

//     expect(mockNavigate).toHaveBeenCalledWith('/main/Course');
//     expect(getByText(/Course updated successfully/)).toBeInTheDocument();
//   });

//   it('redirects to the course list if no permission to add or edit course', async () => {

//      renderRoleComponent();

//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith('/main/Course');
//     });
//   });
});