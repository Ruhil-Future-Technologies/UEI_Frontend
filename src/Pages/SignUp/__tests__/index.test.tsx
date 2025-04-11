import React from 'react';
import { render, fireEvent, } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Signup from '../index';
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
  },
}));

describe('Signup Component', () => {
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
          <Signup />
        </Router>
      </NameContext.Provider>,
    );
  };

  it('renders the Signup component', () => {
    const { getByText } = renderRoleComponent();

    expect(getByText('Sign Up')).toBeInTheDocument();
    expect(getByText('Email')).toBeInTheDocument();
    expect(getByText('Phone No.')).toBeInTheDocument();
    expect(getByText('Password')).toBeInTheDocument();
    expect(
      getByText('By Creating your account you have to agree with our'),
    ).toBeInTheDocument();
  });

  it('validates email and phone inputs', () => {
    const { getByText, getByTestId } = renderRoleComponent();
    const emailInput = getByTestId('email').querySelector(
      'input',
    ) as HTMLInputElement;
    const phoneInput = getByTestId('phone').querySelector(
      'input',
    ) as HTMLInputElement;

    // const submitButton = getByRole("button", { name: /Sign Up Now/i });

    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    fireEvent.change(phoneInput, { target: { value: '123' } });
    // fireEvent.click(submitButton);

    expect(getByText(/Invalid email format/)).toBeInTheDocument();
    expect(getByText(/Invalid phone number/)).toBeInTheDocument();
  });

  it('validates password input', () => {
    const { getByText, getByTestId, queryByText } = renderRoleComponent();

    // const passwordInput = screen.getByLabelText(/Password/i);
    const passwordInput = getByTestId('Password').querySelector(
      'input',
    ) as HTMLInputElement;

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
  });

  // it('disables submit button when terms and conditions are not accepted', () => {
  //   renderRoleComponent();

  //   const submitButton = screen.getByRole('button', { name: /Sign Up Now/i });
  //   const termsCheckbox = screen.getByRole('checkbox');

  //   expect(submitButton).toBeDisabled();

  //   fireEvent.click(termsCheckbox);

  //   expect(submitButton).not.toBeDisabled();
  // });

  // it('calls the API with valid inputs', async () => {
  //   mockPostData.mockResolvedValue({
  //     status: 200,
  //     message: 'Signup successful',
  //   });

  //   const { getByRole, getByTestId } = renderRoleComponent();

  //   const emailInput = getByTestId('email').querySelector(
  //     'input',
  //   ) as HTMLInputElement;
  //   const phoneInput = getByTestId('phone').querySelector(
  //     'input',
  //   ) as HTMLInputElement;
  //   const passwordInput = getByTestId('Password').querySelector(
  //     'input',
  //   ) as HTMLInputElement;
  //   const termsCheckbox = getByTestId('checkbox');
  //   const submitButton = getByRole('button', { name: /Sign Up Now/i });

  //   fireEvent.change(emailInput, {
  //     target: { value: 'test@example.com' },
  //   });
  //   fireEvent.change(phoneInput, { target: { value: '9876543210' } });
  //   fireEvent.change(passwordInput, { target: { value: 'ValidPass1!' } });
  //   fireEvent.click(termsCheckbox);
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(mockPostData).toHaveBeenCalledWith(
  //       expect.any(String),
  //       expect.objectContaining({
  //         email: 'test@example.com',
  //         phone: '9876543210',
  //         password: 'ValidPass1!',
  //         user_type: 'student',
  //       }),
  //     );
  //   });
  // });

  // it('displays an error when the API call fails', async () => {
  //   mockPostData.mockRejectedValue(new Error('An unexpected error occurred'));
  //   const { getByRole, getByTestId } = renderRoleComponent();

  //   const emailInput = getByTestId('email').querySelector(
  //     'input',
  //   ) as HTMLInputElement;

  //   const phoneInput = getByTestId('phone').querySelector(
  //     'input',
  //   ) as HTMLInputElement;
  //   const passwordInput = getByTestId('Password').querySelector(
  //     'input',
  //   ) as HTMLInputElement;
  //   const termsCheckbox = getByTestId('checkbox');
  //   const submitButton = getByRole('button', { name: /Sign Up Now/i });

  //   fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  //   fireEvent.change(phoneInput, { target: { value: '9876543210' } });
  //   fireEvent.change(passwordInput, { target: { value: 'ValidPass1!' } });
  //   fireEvent.click(termsCheckbox);
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     // eslint-disable-next-line @typescript-eslint/no-require-imports
  //     expect(require('react-toastify').toast.error).toHaveBeenCalledWith(
  //       'An unexpected error occurred',
  //       expect.any(Object),
  //     );
  //   });
  // });
});
