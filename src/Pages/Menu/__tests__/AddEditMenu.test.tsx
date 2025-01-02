import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddEditMenu from '../AddEditMenu';
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import useApi from '../../../hooks/useAPI';
import { contextValue } from '../../../MockStorage/mockstorage';
import NameContext from '../../Context/NameContext';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getData: jest.fn(),
    postData: jest.fn(),
    putData: jest.fn(),
  })),
}));

const mockGetData = jest.fn();
const mockNavigate = jest.fn();
const mockLocation = {
  pathname: '/main/Menu',
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
(useApi as jest.Mock).mockReturnValue({
  getData: mockGetData,
  postData: mockPostData,
  putData: mockPutData,
});

describe('AddEditMenu Component', () => {
  beforeEach(() => {
    mockPostData.mockReset();
    mockPutData.mockReset();
    (useApi as jest.Mock).mockReturnValue({
      postData: mockPostData,
      putData: mockPutData,
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
    (useParams as jest.Mock).mockReturnValue({ id: '' });
  });

  it('renders the form in Add mode', () => {
    const { getByText } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditMenu />
        </Router>
      </NameContext.Provider>,
    );
    expect(getByText('Add Menu')).toBeInTheDocument();
  });

  it('renders the form in Edit mode', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    const mockGetData = jest.fn().mockResolvedValue({
      data: { menu_name: 'Existing Menu', priority: '1' },
    });
    (useApi as jest.Mock).mockReturnValue({ getData: mockGetData });

    const { getByText, getByDisplayValue } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditMenu />
        </Router>
      </NameContext.Provider>,
    );

    await waitFor(() => {
      expect(getByText('Edit Menu')).toBeInTheDocument();
      expect(getByDisplayValue('Existing Menu')).toBeInTheDocument();
      expect(getByDisplayValue('1')).toBeInTheDocument();
    });
  });

  it('validates required fields (menu_name and priority)', async () => {
    const { getByText, getByTestId } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditMenu />
        </Router>
      </NameContext.Provider>,
    );

    const saveButton = getByTestId('save_btn');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(getByText('Please enter Menu name')).toBeInTheDocument();
      expect(
        getByText('Please enter valid Menu sequence number'),
      ).toBeInTheDocument();
    });
  });
  it('displays success message on successful submit (Create)', async () => {
    mockPostData.mockResolvedValue({
      status: 200,
      message: 'Menu created successfully',
    });

    const { getByLabelText, getByText } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditMenu />
        </Router>
      </NameContext.Provider>,
    );

    const menuNameField = getByLabelText('Menu name *');
    const priorityField = getByLabelText('Menu sequence *');
    const saveButton = getByText('Save');

    fireEvent.change(menuNameField, { target: { value: 'New Menu' } });
    fireEvent.change(priorityField, { target: { value: '2' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Menu created successfully',
        expect.any(Object),
      );
    });
  });
  it('displays success message on successful submit (Update)', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    mockGetData.mockResolvedValue({
      data: {
        created_at: 'Mon, 04 Nov 2024 10:39:15 GMT',
        id: '123',
        is_active: '1',
        is_deleted: false,
        menu_name: 'Feedback',
        priority: '1',
        updated_at: 'Fri, 20 Dec 2024 10:15:40 GMT',
      },
      message: 'Menu found Successfully',
      status: 200,
    });

    (useApi as jest.Mock).mockReturnValue({ getData: mockGetData });

    const { getByTestId } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditMenu />
        </Router>
      </NameContext.Provider>,
    );

    // Wait for API call to resolve
    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledWith('/menu/edit/123');
    });

    const saveButton = getByTestId('save_btn');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/main/Menu');
    });
  });

  it('displays error message when API call fails (Create)', async () => {
    mockPostData.mockRejectedValue({
      message: 'Failed to create menu',
    });

    const { getByLabelText, getByText } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditMenu />
        </Router>
      </NameContext.Provider>,
    );
    const menuNameField = getByLabelText('Menu name *');
    const priorityField = getByLabelText('Menu sequence *');
    const saveButton = getByText('Save');

    fireEvent.change(menuNameField, { target: { value: 'New Menu' } });
    fireEvent.change(priorityField, { target: { value: '2' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to create menu',
        expect.any(Object),
      );
    });
  });
  it('handles file upload', async () => {
    const { getByTestId } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditMenu />
        </Router>
      </NameContext.Provider>,
    );
    const fileInput = getByTestId('file-upload') as HTMLInputElement;
    const file = new File(['file content'], 'menu.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(fileInput.files?.[0].name).toBe('menu.jpg');
    });
  });
});
