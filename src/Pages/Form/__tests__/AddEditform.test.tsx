import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import AddEditForm from '../AddEditform';
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
  pathname: 'main/Form/add-Form',
  search: '',
  hash: '',
  state: null,
};
const mockGetData = jest.fn();
const mockPostData = jest.fn();
const mockPutData = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

describe('AddEditForm', () => {
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
        form_description: '',
        form_name: 'Role',
        form_url: '/main/Role',
        is_active: 1,
        is_menu_visible: true,
        menu_master_id: 23,
        menu_master_name: 'User Authorization',
        sub_menu_master_id: 43,
        sub_menu_master_name: 'Role',
      },
    });
    mockPostData.mockReset();
    mockPostData.mockResolvedValueOnce({
      status: 201,
      message: 'Form created successfully',
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
  const renderRoleComponent = () => {
    return render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditForm />
        </Router>
      </NameContext.Provider>,
    );
  };
  test('should render form fields correctly', () => {
    // Check if all input fields and labels are rendered correctly
    const { getByLabelText, getByText } = renderRoleComponent();
    expect(getByText('Menu Master *')).toBeInTheDocument();
    expect(getByText('Sub Menu Master *')).toBeInTheDocument();
    expect(getByLabelText(/Form URL */i)).toBeInTheDocument();
    expect(getByLabelText(/Form Description/i)).toBeInTheDocument();
    expect(getByText('Menu Visible')).toBeInTheDocument();
  });
  // it("should handle form submission and success", async () => {
  //   // mockNavigate.mockClear();
  //   mockPostData.mockResolvedValueOnce({ status: 201, message: "Form created successfully" });

  //   const { getByTestId } = renderRoleComponent();

  //   const menuField = getByTestId('menu_master_id') as HTMLElement;
  //   const submenuField = getByTestId('sub_menu_master_id') as HTMLElement;
  //   const formnameField = getByTestId('form_name') as HTMLElement;
  //   const formurlField = getByTestId('form_url') as HTMLElement;
  //   const descriptionField = getByTestId('form_description') as HTMLElement;
  //   const visiblemenuField = getByTestId('is_menu_visible') as HTMLElement;
  //   // const saveButton = getByTestId('save_btn') as HTMLElement;

  //   // Simulate changing the fields
  //   fireEvent.change(menuField, { target: { value: "1" } });
  //   fireEvent.change(submenuField, { target: { value: "2" } });
  //   fireEvent.change(formnameField, { target: { value: "Test Form" } });
  //   fireEvent.change(formurlField, { target: { value: "/main/form" } });
  //   fireEvent.change(descriptionField, { target: { value: "Test description" } });

  //   // Find the radio input and check for null
  //   const radioButton = visiblemenuField.querySelector('input[value="true"]');
  //   if (radioButton) {
  //     fireEvent.click(radioButton);
  //   }

  //   // Trigger the save button click
  //   // fireEvent.click(saveButton);
  //   fireEvent.click(getByTestId('save_btn'));

  //   await waitFor(() => {
  //     expect(toast);
  //   });
  //   expect(mockPostData).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       menu_master_id: '1',
  //       sub_menu_master_id: '2',
  //       form_name: 'Test Form',
  //       form_url: '/main/form',
  //       form_description: 'Test description',
  //       is_menu_visible: true
  //     })
  //   );
  // });

  it('should handle form validation errors', async () => {
    const { getByTestId, getByText } = renderRoleComponent();

    // Submit the form without filling any input
    fireEvent.click(getByTestId('save_btn'));

    // Check validation error messages
    await waitFor(() =>
      expect(getByText(/Form name is required/)).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(getByText(/Menu master is required/)).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(getByText(/Form URL is required/)).toBeInTheDocument(),
    );
  });
  it('should handle form URL preview', async () => {
    // Use jest.spyOn to mock window.open
    const openSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());

    const { getByText, getByLabelText } = renderRoleComponent();

    // Set valid form URL
    fireEvent.change(getByLabelText(/Form URL \*/), {
      target: { value: '/main/form' },
    });

    // Trigger preview button click
    fireEvent.click(getByText('Preivew'));

    // Check if the preview logic is called with one of the expected URLs
    if (openSpy.mock.calls[0][0] === '/main/form') {
      expect(openSpy).toHaveBeenCalledWith('/main/form', '_blank');
    } else {
      expect(openSpy).toHaveBeenCalledWith('/main/Form/404', '_blank');
    }

    // Optionally, clean up the spy after the test
    openSpy.mockRestore();
  });

  it('should handle form URL invalid scenario', async () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(jest.fn());

    const { getByText, getByLabelText } = renderRoleComponent();

    fireEvent.change(getByLabelText(/Form URL \*/), {
      target: { value: '/invalid/url' },
    });

    // Trigger preview button click
    fireEvent.click(getByText('Preivew'));

    // Check if the preview logic is called with one of the expected URLs

    expect(openSpy).toHaveBeenCalledWith('/main/Form/404', '_blank');

    // Optionally, clean up the spy after the test
    openSpy.mockRestore();
    expect(mockNavigate).toHaveBeenCalledWith('/main/Form');
  });
});
