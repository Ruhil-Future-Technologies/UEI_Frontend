import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SuperAdmin from '../SuperAdmin'; // Adjust the import path as necessary
import NameContext from '../../Context/NameContext'; // Adjust the import path as necessary
import { contextValue, mockStorage } from '../../../MockStorage/mockstorage';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import { toast } from 'react-toastify';
import { QUERY_KEYS } from '../../../utils/const';
import useApi from '../../../hooks/useAPI';

// Mock the external dependencies
jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockPostData = jest.fn();
const mockPutData = jest.fn();
const mockGetData = jest.fn();

describe('SuperAdmin Component', () => {
  beforeEach(() => {
    global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);

    mockPostData.mockReset();
    mockPutData.mockReset();
    mockGetData.mockReset();

    // Mock the `useApi` hook to return these methods
    (useApi as jest.Mock).mockReturnValue({
      getData: mockGetData,
      postData: mockPostData,
      putData: mockPutData,
    });
  });

  it('should render the change password and confirm password field', () => {
    const { getByTestId } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <SuperAdmin />
        </Router>
      </NameContext.Provider>,
    );

    const useridInput = getByTestId('userid');
    const passwordInput = getByTestId('password');
    expect(useridInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('validates email input correctly', async () => {
    const { getByLabelText, getByRole, getByText } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <SuperAdmin />
        </Router>
      </NameContext.Provider>,
    );
    fireEvent.change(getByLabelText(/Email or Mobile Number \*/i), {
      target: { value: 'invalid-email' },
    });

    fireEvent.blur(screen.getByLabelText(/Email or Mobile Number \*/i));
    fireEvent.click(getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(
        getByText(/Please enter a valid email or phone number/i),
      ).toBeInTheDocument();
    });
  });

  it('validates password input correctly', async () => {
    const { getByLabelText, getByRole, getByText } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <SuperAdmin />
        </Router>
      </NameContext.Provider>,
    );
    fireEvent.change(getByLabelText(/Password \*/i), {
      target: { value: 'short' },
    });

    fireEvent.blur(screen.getByLabelText(/Password \*/i));
    fireEvent.click(getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(
        getByText(/Password must contain at least one uppercase letter/i),
      ).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const mockSuccessResponse = {
      message: 'User created successfully',
      status: 200,
    };
    mockPostData.mockResolvedValue(mockSuccessResponse);
    render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <SuperAdmin />
        </Router>
      </NameContext.Provider>,
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/Email or Mobile Number \*/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/Password \*/i), {
      target: { value: 'ValidPassword1!' },
    });

    // Submit the form by clicking the "Save" button
    const submitButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'User created successfully',
        expect.any(Object),
      );
    });

    // Verify the API was called with the correct payload
    await waitFor(() => {
      expect(useApi().postData).toHaveBeenCalledWith(QUERY_KEYS.POST_SIGNUP, {
        user_type: 'admin',
        userid: 'test@example.com',
        password: 'ValidPassword1!',
      });
    });

    // Ensure the form is reset (i.e., values are cleared)
    await waitFor(() => {
      const useridField = screen.getByLabelText(
        /Email or Mobile Number \*/i,
      ) as HTMLInputElement;
      const passwordField = screen.getByLabelText(
        /Password \*/i,
      ) as HTMLInputElement;

      expect(useridField.value).toBe('');
      expect(passwordField.value).toBe('');
    });
  });

  it('displays error message when API call fails', async () => {
    const mockErrorResponse = {
      message: 'Failed to create user',
      status: 500,
    };

    // Mock the postData call to reject with an error response
    mockPostData.mockRejectedValue(mockErrorResponse);

    render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <SuperAdmin />
        </Router>
      </NameContext.Provider>,
    );

    // Fill out the form fields
    fireEvent.change(screen.getByLabelText(/Email or Mobile Number \*/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/Password \*/i), {
      target: { value: 'ValidPassword1!' },
    });

    // Ensure the Save button is enabled (after form is filled out)
    const submitButton = screen.getByRole('button', { name: /Save/i });
    expect(submitButton).toBeEnabled();

    // Submit the form by clicking the "Save" button
    fireEvent.click(submitButton);

    // Wait for error message and verify it
    await waitFor(() => {
      // Assuming you are using toast.error to display error messages
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to create user',
        expect.any(Object),
      );
    });

    // Verify the API was called with the correct payload
    await waitFor(() => {
      expect(useApi().postData).toHaveBeenCalledWith(QUERY_KEYS.POST_SIGNUP, {
        user_type: 'admin',
        userid: 'test@example.com',
        password: 'ValidPassword1!',
      });
    });

    // Ensure the form is not reset (since the submission failed)
    await waitFor(() => {
      const useridField = screen.getByLabelText(
        /Email or Mobile Number \*/i,
      ) as HTMLInputElement;
      const passwordField = screen.getByLabelText(
        /Password \*/i,
      ) as HTMLInputElement;

      expect(useridField.value).toBe('test@example.com'); // Form should not be reset
      expect(passwordField.value).toBe('ValidPassword1!');
    });
  });
});
