import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import AddEditRolevsAdmin from '../AddEditRolevsAdmin';
import NameContext from '../../Context/NameContext';
import { contextValue } from '../../../MockStorage/mockstorage';
import useApi from '../../../hooks/useAPI';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockLocation = {
  pathname: 'main/RoleVsUser/add-RoleVsAdmin',
  search: '',
  hash: '',
  state: null,
};
const mockGetData = jest.fn();
const mockPostData = jest.fn();
const mockPutData = jest.fn();
jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    postData: jest.fn().mockResolvedValueOnce({
      status: 200,
      message: 'RolevsUser Data  created successfully',
    }),
    getData: jest.fn(),
    putData: jest.fn(),
  }),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

describe('AddEditRolevsAdmin', () => {
  beforeAll(() => {
    // Mock window.open before any tests run
    window.open = jest.fn();
  });

  beforeEach(() => {
    mockPostData.mockReset();
    mockPutData.mockReset();
    mockGetData.mockReset();
    mockGetData.mockResolvedValue({
      data: {
        data: [
          { id: '1', role_name: 'Admin Role', is_active: 1 },
          { id: '2', role_name: 'User Role', is_active: 1 },
        ],
      },
    });
    mockPostData.mockReset();
    mockPutData.mockReset();
    (useApi as jest.Mock).mockReturnValue({
      getData: mockGetData,
      postData: mockPostData,
      putData: mockPutData,
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
    (useParams as jest.Mock).mockReturnValue({ id: '' });
  });

  const renderRoleComponent = () => {
    return render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditRolevsAdmin />
        </Router>
      </NameContext.Provider>,
    );
  };

  it('should render the form correctly for adding a new role vs admin', async () => {
    const { getByText } = renderRoleComponent();

    expect(getByText('Role Master *')).toBeInTheDocument();
    expect(getByText('Admin *')).toBeInTheDocument();

    // Check if the save button is rendered
    const saveButton = getByText('Save');
    expect(saveButton).toBeInTheDocument();
  });

  it('should display error messages when form fields are not filled in', async () => {
    const { getByText, getByTestId } = renderRoleComponent();
    fireEvent.click(getByTestId('save_btn'));
    await waitFor(() => {
      expect(getByText('Please select Role Matser')).toBeInTheDocument();
      expect(getByText('Please select Admin')).toBeInTheDocument();
    });
  });

  // it('should call the correct API method on form submit for add', async () => {
  //   const { getByTestId } = renderRoleComponent();

  //   // Mock useParams to simulate add scenario (no ID provided)
  //   (useParams as jest.Mock).mockReturnValue({ id: "" });

  //   // Mock the API call to simulate a successful response
  //   mockPostData.mockResolvedValue({
  //     status: 200,
  //     message: 'RolevsUser Data created successfully',
  //   });

  //   // Simulate filling in the form fields
  //   fireEvent.change(getByTestId('role_master_id'), { target: { value: '1' } });
  //   fireEvent.change(getByTestId('admin_id'), { target: { value: '1' } });

  //   // Simulate clicking the save button
  //   fireEvent.click(getByTestId('save_btn'));

  //   // Wait for async operations to complete
  //   await waitFor(() => {
  //     expect(toast.success).toHaveBeenCalledWith(
  //       'RolevsUser Data created successfully',
  //       expect.any(Object)
  //     );
  //   });

  //   // Ensure the API call was made with the correct data
  //   expect(mockPostData).toHaveBeenCalledWith({
  //     role_master_id: '1',
  //     admin_id: '1',
  //   });
  // });

  // it('should call the correct API method on form submit for edit', async () => {
  //   // Mocking the params to simulate an edit scenario
  //   (useParams as jest.Mock).mockReturnValue({ id: '123' });

  //   mockGetData.mockResolvedValueOnce({
  //     data: {
  //       role_master_id: '2',
  //       admin_id: '2',
  //     },
  //   });

  //   const {getByTestId } = renderRoleComponent();

  //    const roleField = getByTestId('role_master_id') as HTMLElement;
  //   const adminField = getByTestId('admin_id') as HTMLElement;
  //   fireEvent.change(roleField, { target: { value: '2' } });
  //   fireEvent.change(adminField, { target: { value: '2' } });
  //   fireEvent.click(getByTestId('save_btn'));
  //   await waitFor(() => {
  //         expect(toast.success).toHaveBeenCalledWith('RolevsUser Data  updated successfully', expect.any(Object));
  //       });
  // });

  it('should redirect to the appropriate page after form submission', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    mockGetData.mockResolvedValueOnce({
      data: {
        role_master_id: '2',
        admin_id: '2',
      },
    });
    const { getByTestId } = renderRoleComponent();

    const roleField = getByTestId('role_master_id') as HTMLElement;
    const adminField = getByTestId('admin_id') as HTMLElement;
    fireEvent.change(roleField, { target: { value: '2' } });
    fireEvent.change(adminField, { target: { value: '2' } });
    fireEvent.click(getByTestId('save_btn'));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/main/RoleVsUser');
    });
  });
});
