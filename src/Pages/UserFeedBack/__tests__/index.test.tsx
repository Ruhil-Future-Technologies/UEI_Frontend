import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import useApi from "../../../hooks/useAPI";
import Feedback from "../index";
import React from "react";

// Mocking the useApi hook
jest.mock("../../../hooks/useAPI", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Testing Feedback component", () => {
  const mockGetData = jest.fn();
  const mockPostData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useApi as jest.Mock).mockReturnValue({
      getData: mockGetData,
      postData: mockPostData,
    });

    // Mock the response for getData
    // Mock the response for getData
    mockGetData.mockResolvedValue({
      status: 200,
      data: [
        {
          id: "1",
          question: "What is your favorite color?",
          options: "{Red, Blue, Green}",
        },
        {
          id: "2",
          question: "What is your favorite animal?",
          options: "{Dog, Cat, Rabbit}",
        },
      ],
    });
  });

  it("should render the first question and allow selecting an option", async () => {
    // Render the Feedback component
    render(<Feedback />);

    // Wait for the question and options to be rendered
    await waitFor(() => {
      expect(
        screen.getByText(/What is your favorite color\?/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/Red/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Blue/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Green/i)).toBeInTheDocument();
    });

    // Select an option
    fireEvent.click(screen.getByLabelText(/Blue/i));

    // Typecast the element to HTMLInputElement to access the 'checked' property
    const blueOption = screen.getByLabelText(/Blue/i) as HTMLInputElement;

    // Check if the option is selected
    expect(blueOption.checked).toBe(true);
  });

  it("should allow navigation to next question", async () => {
    render(<Feedback />);

    // Wait for the first question and options
    await waitFor(() => {
      expect(
        screen.getByText(/What is your favorite color\?/i)
      ).toBeInTheDocument();
    });

    // Select an option and click next
    fireEvent.click(screen.getByLabelText(/Blue/i));
    fireEvent.click(screen.getByText(/Next/i));

    // Wait for the next question
    await waitFor(() => {
      expect(
        screen.getByText(/What is your favorite animal\?/i)
      ).toBeInTheDocument();
    });
  });
});
