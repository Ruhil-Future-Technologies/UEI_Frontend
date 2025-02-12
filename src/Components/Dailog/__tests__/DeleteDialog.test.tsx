import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { DeleteDialog } from '../DeleteDialog';

// Mock the functions for testing
const mockOnCancel = jest.fn();
const mockOnDeleteClick = jest.fn();

describe('DeleteDialog', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockOnCancel.mockClear();
    mockOnDeleteClick.mockClear();
  });

  it('should render the dialog when open', () => {
    render(
      <DeleteDialog
        isOpen={true}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Confirm Close"
      />,
    );

    // Assert that the dialog is rendered
    expect(
      screen.getByText(
        'Are you sure you want to delete this Confirm Close? This action cannot be undone.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('should not render the dialog when closed', () => {
    render(
      <DeleteDialog
        isOpen={true}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Confirm Close"
      />,
    );

    // Assert that the dialog is not rendered
    expect(screen.queryByText('Delete chat ?')).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'Are you sure you want to delete this chat? This action cannot be undone.',
      ),
    ).not.toBeInTheDocument();
  });

  it('should call onCancel when Cancel button is clicked', () => {
    render(
      <DeleteDialog
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

  it('should call onDeleteClick when Delete button is clicked', () => {
    render(
      <DeleteDialog
        isOpen={true}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Confirm Close"
      />,
    );

    // Simulate a click on the Delete button
    fireEvent.click(screen.getByText('Delete'));

    // Assert that onDeleteClick was called
    expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
  });

  it("should render 'Delete file?' when the title is 'Delete file?'", () => {
    render(
      <DeleteDialog
        isOpen={true}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Delete"
      />,
    );

    // Assert that the dialog shows "Delete file?" message
    expect(
      screen.getByText(
        `Are you sure you want to delete this Delete? This action cannot be undone.`,
      ),
    ).toBeInTheDocument();
  });

  it('should close the dialog when onCancel is triggered', () => {
    render(
      <DeleteDialog
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

  it('should trigger the Delete button action', () => {
    render(
      <DeleteDialog
        isOpen={true}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Confirm Close"
      />,
    );

    // Simulate clicking the Delete button
    fireEvent.click(screen.getByText('Delete'));

    // Assert that onDeleteClick was called once
    expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
  });
});
