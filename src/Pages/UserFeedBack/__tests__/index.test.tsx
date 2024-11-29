import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Feedback from "../index";
import React from "react";

// Mocking useApi hook globally
jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeAll(() => {
  // Mocking window alert globally to capture calls in tests
  window.alert = jest.fn();
});

beforeEach(() => {
  // Reset the mock before each test to ensure it's fresh
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { default: useApi } = require('../../../hooks/useAPI');

  // Mock the successful case
  useApi.mockReturnValue({
    getData: jest.fn().mockResolvedValue({
      status: 200,
      data: [
        { question: "What is your favorite color?", options: "Red,Blue,Green" },
        { question: "What is your favorite animal?", options: "Dog,Cat,Bird" }
      ]
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
    expect(window.alert).toHaveBeenCalledWith('Please select an answer before proceeding to the next question.');
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

  // test('should show alert if form submission fails', async () => {
  //   // eslint-disable-next-line @typescript-eslint/no-require-imports
  //   const { default: useApi } = require('../../../hooks/useAPI');
    
  //   // Mocking the failure case for postData (simulating a 404 error)
  //   useApi.mockReturnValueOnce({
  //     getData: jest.fn().mockResolvedValue({
  //       status: 200,
  //       data: [
  //         { question: "What is your favorite color?", options: "Red,Blue,Green" },
  //         { question: "What is your favorite animal?", options: "Dog,Cat,Bird" }
  //       ]
  //     }),
  //     postData: jest.fn().mockResolvedValueOnce({
  //       status: 404,  // Mocking a failed submission with 404 status
  //     }),
  //   });
  
  //   // Mock alert
  //   window.alert = jest.fn();
  
  //   render(<Feedback />);
  
  //   // Wait for the first question to appear
  //   await waitFor(() => screen.getByText(/What is your favorite color\?/i));
  
  //   // Select an answer for the first question
  //   fireEvent.click(screen.getByLabelText(/Blue/i));
  
  //   // Go to the next question
  //   fireEvent.click(screen.getByText(/Next/i));
  
  //   // Select an answer for the second question
  //   fireEvent.click(screen.getByLabelText(/Cat/i));
  
  //   // Simulate reaching the last question and showing the Submit button
  //   fireEvent.click(screen.getByText(/Next/i));
  
  //   // Simulate clicking 'Submit'
  //   fireEvent.click(screen.getByText(/Submit/i));
  //   window.alert = jest.fn();
  
  //   // Check if the error alert is shown with the correct message
  //   expect(window.alert).toHaveBeenCalledWith('Error while submitting feedback. Please try again later.');
  // });
  

  test('should handle when no questions are returned', async () => {
    // Mock the scenario where no questions are returned
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { default: useApi } = require('../../../hooks/useAPI');
    useApi.mockReturnValue({
      getData: jest.fn().mockResolvedValue({ status: 404, data: [] }),
      postData: jest.fn(),
    });
  
    render(<Feedback />);
  
    // Log the DOM for debugging purposes
    console.log(document.body.innerHTML);
  
    // Wait for the "No options available" message to appear
    await waitFor(() => {
      expect(screen.getByText(/No options available/i)).toBeInTheDocument();
    });
  });
  

});
