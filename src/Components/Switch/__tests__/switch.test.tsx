import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from '../switch';
import userEvent from '@testing-library/user-event';

describe('Switch Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the Switch component with label', () => {
    render(
      <Switch isChecked={false} onChange={mockOnChange} label="Test Label" />,
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should render the Switch component without a label', () => {
    render(<Switch isChecked={false} onChange={mockOnChange} />);

    expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should call onChange when toggled', () => {
    render(<Switch isChecked={false} onChange={mockOnChange} />);

    const switchElement = screen.getByRole('checkbox');
    fireEvent.click(switchElement);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('should not call onChange when disabled', () => {
    render(<Switch isChecked={false} onChange={mockOnChange} disabled />);

    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).toBeDisabled();
    userEvent.click(switchElement);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should reflect the correct checked state', () => {
    const { rerender } = render(
      <Switch isChecked={false} onChange={mockOnChange} />,
    );

    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).not.toBeChecked();

    rerender(<Switch isChecked={true} onChange={mockOnChange} />);
    expect(switchElement).toBeChecked();
  });
  it('should handle changes in props dynamically', () => {
    const { rerender } = render(
      <Switch
        isChecked={false}
        onChange={mockOnChange}
        label="Initial Label"
      />,
    );

    expect(screen.getByText('Initial Label')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();

    rerender(
      <Switch isChecked={true} onChange={mockOnChange} label="Updated Label" />,
    );
    expect(screen.getByText('Updated Label')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
