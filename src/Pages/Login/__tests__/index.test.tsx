import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../index';
import useApi from '../../../hooks/useAPI';
import NameContext from '../../Context/NameContext';
import { contextValue } from '../../../MockStorage/mockstorage';

jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(), // Add this line
  },
}));

describe('Login Component', () => {
  const mockPostData = jest.fn();
  const mockGetData = jest.fn();

  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue({
      postData: mockPostData,
      getData: mockGetData,
      loading: false,
    });
  });
  const renderRoleComponent = () => {
    return render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <Login />
        </Router>
      </NameContext.Provider>,
    );
  };

  it('renders the Login component', () => {
    const { getByText, getByTestId } = renderRoleComponent();
    expect(getByText('Sign In')).toBeInTheDocument();
    expect(getByText('Sign in with Email / Phone')).toBeInTheDocument();
    const signInButton = getByTestId('btn-sign');
    fireEvent.click(signInButton);
    expect(screen.getByText(/Email \/ Phone/i)).toBeInTheDocument();
    expect(getByTestId('Password')).toBeInTheDocument();
    expect(getByTestId('submitBtn')).toBeInTheDocument();
  });

  it('validates email or phone input', async () => {
    const { getByText, getByTestId } = renderRoleComponent();
    const signInButton = getByTestId('btn-sign');
    fireEvent.click(signInButton);
    await waitFor(() => {
      expect(getByTestId('email')).toBeInTheDocument();
    });
    const emailPhoneInput = getByTestId('email').querySelector('input');
    if (emailPhoneInput) {
      fireEvent.change(emailPhoneInput, { target: { value: 'invalid' } });
      expect(
        getByText(/Invalid email or phone number format/),
      ).toBeInTheDocument();
    }
  });

  it('validates password input', async () => {
    const { getByText, getByTestId, queryByText } = renderRoleComponent();
    const signInButton = getByTestId('btn-sign');
    fireEvent.click(signInButton);
    await waitFor(() => {
      expect(getByTestId('Password')).toBeInTheDocument();
    });
    // const passwordInput = screen.getByLabelText(/Password/i);
    const passwordInput = getByTestId('Password').querySelector(
      'input',
    ) as HTMLInputElement;
    if (passwordInput) {
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.blur(passwordInput);

      expect(
        getByText(
          /Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long./i,
        ),
      ).toBeInTheDocument();

      fireEvent.change(passwordInput, { target: { value: 'ValidPass1!' } });
      fireEvent.blur(passwordInput);

      expect(
        queryByText(
          /Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long./i,
        ),
      ).not.toBeInTheDocument();
    }
  });
});
