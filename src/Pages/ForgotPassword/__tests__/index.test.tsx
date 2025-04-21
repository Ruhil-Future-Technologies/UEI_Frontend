import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Forgotpassword from '..';

import { MemoryRouter } from 'react-router-dom';

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

describe('Forgotpassword Component', () => {
  const mockPostData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockPostData.mockReset();
    localStorage.setItem('theme', 'light');
  });
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Forgotpassword />
      </MemoryRouter>,
    );

  it('renders the Forgot Password form correctly', () => {
    renderComponent();

    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Email \/ Phone/i)).toBeInTheDocument();
    expect(screen.getByText(/Send Link/i)).toBeInTheDocument();
  });
});
