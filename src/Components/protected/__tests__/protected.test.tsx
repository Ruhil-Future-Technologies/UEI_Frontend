import { render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Protected from '../protected';
import React from 'react';
import { hasSubMenu } from '../../../utils/helpers';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../../utils/helpers', () => ({
  hasSubMenu: jest.fn(),
}));
describe('Protected Component', () => {
  const MockComponent = () => <div>Mock Component</div>;
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('redirects to login if token is not present in localStorage', () => {
    localStorage.removeItem('token'); // Ensure no token is present
    render(
      <MemoryRouter>
        <Protected Component={MockComponent} menuName="mockMenu" />
      </MemoryRouter>,
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  it('renders the NotFound component if user is not allowed', () => {
    localStorage.setItem('token', 'mockToken'); // Mock token
    (hasSubMenu as jest.Mock).mockReturnValue(false); // User is not allowed
    render(
      <MemoryRouter>
        <Protected Component={MockComponent} menuName="mockMenu" />
      </MemoryRouter>,
    );
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
  it('renders the Component if user is allowed', () => {
    localStorage.setItem('token', 'mockToken'); // Mock token
    (hasSubMenu as jest.Mock).mockReturnValue(true); // User is allowed
    render(
      <MemoryRouter>
        <Protected Component={MockComponent} menuName="mockMenu" />
      </MemoryRouter>,
    );
    expect(screen.getByText(/mock component/i)).toBeInTheDocument();
  });
});
