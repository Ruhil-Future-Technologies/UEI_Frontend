import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useApi from "../../../hooks/useAPI";
import StudentFeedback from "../StudentFeedback";

jest.mock("../../../hooks/useAPI");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));
jest.mock("../../Loader/FullScreenLoader", () => jest.fn(() => <div>Loading...</div>));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));
(useNavigate as jest.Mock).mockReturnValue(mockNavigate);
describe("StudentFeedback", () => {
  const mockGetData = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (useApi as jest.Mock).mockReturnValue({
      getData: mockGetData,
      loading: false,
    });
  });
  afterEach(() => {
    jest.clearAllMocks()
  })
  const renderComponent = () => {
    return render(
      <Router>
        <StudentFeedback />
      </Router>
    );
  };
  it("should render the component and display the title", async () => {
    mockGetData.mockResolvedValueOnce({ data: [] });
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("Student Feedback")).toBeInTheDocument();
    });
  });

  it("should handle API errors and show a toast message", async () => {
    const errorMessage = "Failed to fetch feedback data";
    mockGetData.mockRejectedValueOnce({ message: errorMessage });
    renderComponent();
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage, {
        hideProgressBar: true,
        theme: "colored",
      });
    });
  });
  it("should call API, sort data, and update state on success", async () => {
    const mockData = {
      data: [
        { created_at: "2023-12-31T10:00:00Z", student_name: "John Doe" },
        { created_at: "2023-12-30T10:00:00Z", student_name: "Jane Smith" },
      ],
      message: "Success",
      status: 200,
    };
    mockGetData.mockResolvedValueOnce(mockData);
    render(<StudentFeedback />);
    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledWith("/feedback/all_student_feedback");
    });
  });
});
