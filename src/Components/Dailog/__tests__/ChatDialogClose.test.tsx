import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ChatDialogClose } from '../ChatDialogClose';

// Mock the functions for testing
const mockOnCancel = jest.fn();
const mockOnDeleteClick = jest.fn();

describe('ChatDialogClose', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockOnCancel.mockClear();
    mockOnDeleteClick.mockClear();
  });

  it('should render the dialog when open', () => {
    render(
      <ChatDialogClose
        isOpen={true}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Confirm Close"
      />,
    );

    // Assert that the dialog is rendered
    expect(screen.getByText('Confirm Close')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to Close this.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Ok')).toBeInTheDocument();
  });

  it('should not render the dialog when closed', () => {
    render(
      <ChatDialogClose
        isOpen={false}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Confirm Close"
      />,
    );

    // Assert that the dialog is not rendered
    expect(screen.queryByText('Confirm Close')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Are you sure you want to Close this.'),
    ).not.toBeInTheDocument();
  });

  it('should call onCancel when Cancel button is clicked', () => {
    render(
      <ChatDialogClose
        isOpen={true}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Confirm Close"
      />,
    );

    // Simulate a click on the Cancel button
    fireEvent.click(screen.getByText('Cancel'));

    // Assert that onCancel was called
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onDeleteClick when Ok button is clicked', () => {
    render(
      <ChatDialogClose
        isOpen={true}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Confirm Close"
      />,
    );

    // Simulate a click on the Ok button
    fireEvent.click(screen.getByText('Ok'));

    // Assert that onDeleteClick was called
    expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
  });

  it('should close the dialog when onCancel is triggered', () => {
    render(
      <ChatDialogClose
        isOpen={true}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Confirm Close"
      />,
    );

    // Simulate closing the dialog by clicking the Cancel button
    fireEvent.click(screen.getByText('Cancel'));

    // Assert that onCancel was called
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should trigger the Ok button action', () => {
    render(
      <ChatDialogClose
        isOpen={true}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Confirm Close"
      />,
    );

    // Simulate clicking the Ok button
    fireEvent.click(screen.getByText('Ok'));

    // Assert that onDeleteClick was called once
    expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
  });
});
