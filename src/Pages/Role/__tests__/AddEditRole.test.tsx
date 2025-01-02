import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddEditRole from '../AddEditRole';
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
  pathname: '/main/Role',
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
describe('AddEditRole Component', () => {
  beforeEach(() => {
    mockPostData.mockReset();
    mockPutData.mockReset();
    mockGetData.mockReset();
    mockGetData.mockResolvedValue({
      data: { role_name: 'Existing Role' },
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
  it('displays error message when API call fails (GET)', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    const mockErrorResponse = {
      message: 'Failed to load role',
    };
    mockGetData.mockRejectedValue(mockErrorResponse);
    render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditRole />
        </Router>
      </NameContext.Provider>,
    );
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to load role',
        expect.any(Object),
      );
    });
  });
  it('validates role_name input correctly', async () => {
    const { getByText, getByTestId } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditRole />
        </Router>
      </NameContext.Provider>,
    );
    const roleField = getByTestId('role_name') as HTMLElement;
    const save_btn = getByTestId('save_btn') as HTMLElement;
    fireEvent.click(save_btn);
    fireEvent.change(roleField, { target: { value: '' } });
    await waitFor(() => {
      expect(getByText('Please enter Role name')).toBeInTheDocument();
    });
  });
  it('displays success message on successful submit (Create)', async () => {
    mockPostData.mockResolvedValue({
      status: 200,
      message: 'Role created successfully',
    });
    const { getByTestId } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditRole />
        </Router>
      </NameContext.Provider>,
    );
    const roleField = getByTestId('role_name') as HTMLElement;
    const saveButton = getByTestId('save_btn') as HTMLElement;
    fireEvent.change(roleField, { target: { value: 'New Role' } });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Role created successfully',
        expect.any(Object),
      );
    });
  });
  it('displays success message on successful submit (Update)', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    mockPutData.mockResolvedValue({
      status: 200,
      message: 'Role updated successfully',
    });
    const { getByTestId } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditRole />
        </Router>
      </NameContext.Provider>,
    );
    const roleField = getByTestId('role_name') as HTMLElement;
    const saveButton = getByTestId('save_btn') as HTMLElement;
    fireEvent.change(roleField, { target: { value: 'Updated Role' } });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Role updated successfully',
        expect.any(Object),
      );
    });
    expect(mockNavigate).toHaveBeenCalledWith('/main/Role');
  });
  it('displays error message when role name already exists', async () => {
    mockPostData.mockResolvedValue({
      status: 400,
      message: 'Role name already exists',
    });

    const { getByTestId } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditRole />
        </Router>
      </NameContext.Provider>,
    );
    const roleField = getByTestId('role_name') as HTMLElement;
    const saveButton = getByTestId('save_btn') as HTMLElement;
    fireEvent.change(roleField, { target: { value: 'Existing Role' } });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Role name already exists',
        expect.any(Object),
      );
    });
  });
});
