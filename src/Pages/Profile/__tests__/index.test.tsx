import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '..';

// Mock the Profile component (if required)

describe('Profile Component', () => {
  const renderComponent = () => render(<Profile />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Profile component correctly', () => {
    renderComponent();
    expect(
      screen.getByText(/I've rendered atul yadav times!/i),
    ).toBeInTheDocument();
  });

  it('displays the name correctly', () => {
    renderComponent();
    const textContent = screen.getByText(/atul yadav/i);
    expect(textContent).toBeInTheDocument();
  });
});
