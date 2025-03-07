import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddEditHobby from '../AddEditHobby';
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import useApi from '../../../hooks/useAPI';
import { contextValue } from '../../../MockStorage/mockstorage';
import React from 'react';
import NameContext from '../../Context/NameContext';

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
  pathname: '/main/Hobby',
  search: '',
  hash: '',
  state: null,
};
const mockPostData = jest.fn();
const mockPutData = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));
describe('AddEditHobby Component', () => {
  beforeEach(() => {
    mockPostData.mockReset();
    mockPutData.mockReset();
    mockGetData.mockReset();
    mockGetData.mockResolvedValue({
      data: { hobby_name: 'Existing Hobby' },
    });
    (useApi as jest.Mock).mockReturnValue({
      getData: mockGetData,
      postData: mockPostData,
      putData: mockPutData,
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
    (useParams as jest.Mock).mockReturnValue({ id: '' });
  });
  const mockGetData = jest.fn();
  const renderRoleComponent = () => {
    return render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditHobby />
        </Router>
      </NameContext.Provider>,
    );
  };
  it('displays error message when API call fails (GET)', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    const mockErrorResponse = {
      message: 'Failed to load hobby',
    };
    mockGetData.mockRejectedValue(mockErrorResponse);
    renderRoleComponent();
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to load hobby',
        expect.any(Object),
      );
    });
  });
  it('validates hobby_name input correctly', async () => {
    const { getByText, getByTestId } = renderRoleComponent();
    const roleField = getByTestId('hobby_name') as HTMLElement;
    const save_btn = getByTestId('save_btn') as HTMLElement;
    fireEvent.click(save_btn);
    fireEvent.change(roleField, { target: { value: '' } });
    await waitFor(() => {
      expect(getByText('Please enter Hobby name')).toBeInTheDocument();
    });
  });
  it('displays success message on successful submit (Create)', async () => {
    mockPostData.mockResolvedValue({
      status: 200,
      message: 'Hobby created successfully',
    });
    const { getByTestId } = renderRoleComponent();
    const roleField = getByTestId('hobby_name') as HTMLElement;
    const saveButton = getByTestId('save_btn') as HTMLElement;
    fireEvent.change(roleField, { target: { value: 'New Role' } });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Hobby created successfully',
        expect.any(Object),
      );
    });
  });
  it('displays success message on successful submit (Update)', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    mockPutData.mockResolvedValue({
      status: 200,
      message: 'Hobby updated successfully',
    });
    const { getByTestId } = renderRoleComponent();
    const roleField = getByTestId('hobby_name') as HTMLElement;
    const saveButton = getByTestId('save_btn') as HTMLElement;
    fireEvent.change(roleField, { target: { value: 'Updated Hobby' } });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Hobby updated successfully',
        expect.any(Object),
      );
    });
    expect(mockNavigate).toHaveBeenCalledWith('/main/Hobby');
  });
  it('displays error message when hobby name already exists', async () => {
    mockPostData.mockResolvedValue({
      code: 400,
      message: 'Hobby name already exists',
    });

    const { getByTestId } = renderRoleComponent();
    const roleField = getByTestId('hobby_name') as HTMLElement;
    const saveButton = getByTestId('save_btn') as HTMLElement;
    fireEvent.change(roleField, { target: { value: 'Existing Hobby' } });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Hobby name already exists',
        expect.any(Object),
      );
    });
  });
});
