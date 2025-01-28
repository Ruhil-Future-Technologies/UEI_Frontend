import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminFeedback from '..'; // Update with correct path
import { toast } from 'react-toastify';
import useApi from '../../../hooks/useAPI';

jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getData: jest.fn(),
    postData: jest.fn(),
    putData: jest.fn(),
    postFileData: jest.fn(),
  })),
}));
// Mocking useApi hook
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe('AdminFeedback Component', () => {
  const mockPostData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useApi as jest.Mock).mockImplementation(() => ({
      postData: mockPostData,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the feedback form correctly', () => {
    render(<AdminFeedback />);

    expect(
      screen.getByPlaceholderText('Add your question'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('save')).toBeInTheDocument();
  });

  test('handles question input change', () => {
    render(<AdminFeedback />);

    const questionInput = screen.getByPlaceholderText(
      'Add your question',
    ) as HTMLInputElement;
    fireEvent.change(questionInput, {
      target: { value: 'What is your favorite color?' },
    });

    expect(questionInput.value).toBe('What is your favorite color?');
  });

  test('handles option input change', () => {
    render(<AdminFeedback />);

    const optionInput = screen.getByPlaceholderText(
      'Option 1',
    ) as HTMLInputElement;
    fireEvent.change(optionInput, { target: { value: 'Red' } });

    expect(optionInput.value).toBe('Red');
  });

  test('adds a new option when AddIcon is clicked', () => {
    render(<AdminFeedback />);

    const addButton = screen.getByTestId('add-option'); // Add testId to AddIcon for easy access
    fireEvent.click(addButton);

    expect(screen.getAllByPlaceholderText(/^Option/).length).toBe(2); // Check if 2 options are now present
  });

  //   test('deletes an option when DeleteIcon is clicked', () => {
  //     render(<AdminFeedback />);

  //     const deleteButton = screen.getByTestId('delete-option-1'); // Add testId to DeleteIcon for easy access
  //     fireEvent.click(deleteButton);

  //     expect(screen.getAllByPlaceholderText(/^Option/).length).toBe(1); // Check if 1 option remains
  //   });

  test('calls postData and shows success toast on save', async () => {
    render(<AdminFeedback />);
    mockPostData.mockResolvedValue({
      status: 200,
      message: 'question added successfully',
    });
    const questionInput = screen.getByPlaceholderText(
      'Add your question',
    ) as HTMLInputElement;
    fireEvent.change(questionInput, {
      target: { value: 'What is your favorite color?' },
    });

    const optionInput = screen.getByPlaceholderText(
      'Option 1',
    ) as HTMLInputElement;
    fireEvent.change(optionInput, { target: { value: 'Red' } });

    const saveButton = screen.getByText('save');
    fireEvent.click(saveButton);

    await waitFor(() => expect(mockPostData).toHaveBeenCalledTimes(1));
    expect(mockPostData).toHaveBeenCalledWith('/feedback/add', {
      question: 'What is your favorite color?',
      options: ['Red'],
    });
    expect(toast.success).toHaveBeenCalledWith('question added successfully', {
      hideProgressBar: true,
      theme: 'colored',
    });
  });

  test('clears the form after successful save', async () => {
    render(<AdminFeedback />);
    mockPostData.mockResolvedValue({
      status: 200,
      message: 'question added successfully',
    });

    const questionInput = screen.getByPlaceholderText(
      'Add your question',
    ) as HTMLInputElement;
    fireEvent.change(questionInput, {
      target: { value: 'What is your favorite color?' },
    });

    const optionInput = screen.getByPlaceholderText(
      'Option 1',
    ) as HTMLInputElement;
    fireEvent.change(optionInput, { target: { value: 'Red' } });

    const saveButton = screen.getByText('save');
    fireEvent.click(saveButton);

    await waitFor(() => expect(mockPostData).toHaveBeenCalledTimes(1));

    expect(
      (screen.getByPlaceholderText('Add your question') as HTMLInputElement)
        .value,
    ).toBe('');
    expect(
      (screen.getByPlaceholderText('Option 1') as HTMLInputElement).value,
    ).toBe('');
  });

  test('does not show delete icon for the first option', () => {
    render(<AdminFeedback />);

    expect(screen.queryByTestId('delete-option-0')).not.toBeInTheDocument();
  });

  test('shows delete icon for options after the first one', () => {
    render(<AdminFeedback />);

    const addButton = screen.getByTestId('add-option'); // Add testId to AddIcon for easy access
    fireEvent.click(addButton); // Add a new option

    expect(screen.getByTestId('delete-option-1')).toBeInTheDocument();
  });
});
