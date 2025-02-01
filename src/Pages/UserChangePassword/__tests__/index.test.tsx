import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import UserChangePassword from '..';
import NameContext from '../../Context/NameContext';
import { contextValue } from '../../../MockStorage/mockstorage';
jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: () => ({
    postData: jest.fn(),
  }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('UserChangePassword Component', () => {
  const mockPostData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPostData.mockReset();
    localStorage.setItem('userid', 'testuser@example.com');
    localStorage.setItem('user_type', 'user');
  });

  const renderComponent = () =>
    render(
      <NameContext.Provider value={contextValue}>
        <UserChangePassword />
      </NameContext.Provider>,
    );

  it('renders the component without crashing', () => {
    renderComponent();

    const changePasswordButton = screen.getByRole('button', {
      name: /Change Password/i,
    });
    expect(changePasswordButton).toBeInTheDocument();
  });

  it('displays validation errors when form fields are empty', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', {
      name: /Change Password/i,
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(screen.getAllByText(/Please enter a password/i).length).toBeGreaterThan(0);

  });

  it('toggles password visibility when the visibility icon is clicked', () => {
    renderComponent();

    const toggleButton = screen.getAllByRole('button', {
      name: /toggle password visibility/i,
    })[0];

    const passwordInput = screen.getByLabelText(/Current Password/i);

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
