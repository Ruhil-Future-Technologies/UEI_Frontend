import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Feedback from '../index';
import React from 'react';
import useApi from '../../../hooks/useAPI';

// Mocking useApi hook globally
jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(),
}));
(useApi as jest.Mock).mockReturnValue({
  getData: jest.fn().mockResolvedValue({ status: 404, data: [] }),
  postData: jest.fn(),
});
beforeAll(() => {
  window.alert = jest.fn();
});

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { default: useApi } = require('../../../hooks/useAPI');

  // Mock the successful case
  useApi.mockReturnValue({
    getData: jest.fn().mockResolvedValue({
      status: 200,
      data: [
        { question: 'What is your favorite color?', options: 'Red,Blue,Green' },
        { question: 'What is your favorite animal?', options: 'Dog,Cat,Bird' },
      ],
    }),
    postData: jest.fn(),
  });
});

describe('Testing Feedback component', () => {
  test('should show alert if trying to go to the next question without selecting an answer', async () => {
    render(<Feedback />);

    // Wait for the first question to appear
    await waitFor(() => screen.getByText(/What is your favorite color\?/i));

    // Try to click 'Next' without selecting an answer
    fireEvent.click(screen.getByText(/Next/i));

    // Check if alert is shown
    expect(window.alert).toHaveBeenCalledWith(
      'Please select an answer before proceeding to the next question.',
    );
  });

  test('should submit the form successfully when all questions are answered', async () => {
    render(<Feedback />);

    // Wait for the first question to appear
    await waitFor(() => screen.getByText(/What is your favorite color\?/i));

    // Select an answer for the first question
    fireEvent.click(screen.getByLabelText(/Blue/i));

    // Go to the next question
    fireEvent.click(screen.getByText(/Next/i));

    // Select an answer for the second question
    fireEvent.click(screen.getByLabelText(/Cat/i));

    // Simulate reaching the last question and showing the Submit button
    fireEvent.click(screen.getByText(/Next/i));

    // Now simulate clicking 'Submit'
    fireEvent.click(screen.getByText(/Submit/i));

    // Check if the submission alert is shown
    expect(window.alert).toHaveBeenCalledWith('Form submitted successfully');
  });

  test('should handle when no questions are returned', async () => {
    // Mock the scenario where no questions are returned
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { default: useApi } = require('../../../hooks/useAPI');
    useApi.mockReturnValue({
      getData: jest.fn().mockResolvedValue({ status: 200, data: [] }), // Mock empty data
      postData: jest.fn(),
    });

    render(<Feedback />);

    // Wait for the "No options available" message to appear
    const noOptionsMessage = await screen.findByText(/No options available/i);
    expect(noOptionsMessage).toBeInTheDocument();
  });

  test('should go back to the previous question when "Back" is clicked', async () => {
    render(<Feedback />);

    // Wait for the first question to appear
    await waitFor(() => screen.getByText(/What is your favorite color\?/i));

    // Select an answer for the first question
    fireEvent.click(screen.getByLabelText(/Blue/i));

    // Go to the next question
    fireEvent.click(screen.getByText(/Next/i));

    // Wait for the second question to appear
    await waitFor(() => screen.getByText(/What is your favorite animal\?/i));

    // Select an answer for the second question
    fireEvent.click(screen.getByLabelText(/Cat/i));

    // Go to the previous question using a more specific query
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);

    // Check that the first question is back on the screen
    await waitFor(() => screen.getByText(/What is your favorite color\?/i));

    // Get the Blue option and check if it's selected
    const blueOption = screen.getByLabelText(/Blue/i) as HTMLInputElement;
    expect(blueOption.checked).toBe(true); // Check if the radio button is selected

    // Ensure the question options for the first question are displayed
    expect(screen.getByText(/Red/i)).toBeInTheDocument();
    expect(screen.getByText(/Blue/i)).toBeInTheDocument();
    expect(screen.getByText(/Green/i)).toBeInTheDocument();
    expect(screen.getByText(/1\/3/)).toBeInTheDocument();
  });
});
