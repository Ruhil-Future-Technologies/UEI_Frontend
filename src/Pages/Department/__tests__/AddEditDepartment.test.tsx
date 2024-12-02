import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AddEditDepartment from "../AddEditDepartment";
import React from "react";
import NameContext from "../../Context/NameContext";
import { BrowserRouter } from "react-router-dom";
import useApi from "../../../hooks/useAPI";
import { contextValue, mockStorage } from "../../../MockStorage/mockstorage";

jest.mock("../../../hooks/useAPI", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "localhost:3000/main/Menu",
  }),
  useNavigate: () => mockedUsedNavigate,
}));

const mockPostData = jest.fn();
const mockPutData = jest.fn();
const mockGetData = jest.fn();
const mockNavigator = jest.fn();
describe("Add Edit Department page", () => {
  beforeEach(() => {
    global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key]);

    mockPostData.mockReset();
    mockPutData.mockReset();
    mockGetData.mockReset();

    // Mock the `useApi` hook to return these methods
    (useApi as jest.Mock).mockReturnValue({
      getData: mockGetData,
      postData: mockPostData,
      putData: mockPutData,
    });
  });

  it("should render add department page", async () => {
    const mockGetData = jest.fn().mockResolvedValue({
      data: { department_name: "Test Department" },
    });
    (useApi as jest.Mock).mockReturnValue({
      getData: mockGetData,
    });

    const { getByTestId } = render(
      <NameContext.Provider value={contextValue}>
        <BrowserRouter>
          <AddEditDepartment />
        </BrowserRouter>
      </NameContext.Provider>
    );

    // Assert that the department_name field is rendered
    expect(getByTestId("department_name")).toBeInTheDocument();
  });

  it("should call handleSubmit on button click for Add Department", async () => {
    render(
      <NameContext.Provider value={contextValue}>
        <BrowserRouter>
          <AddEditDepartment />
        </BrowserRouter>
      </NameContext.Provider>
    );

    // Get the form input and button elements
    const departmentInput = screen.getByLabelText(/Department Name/i);
    const submitButton = screen.getByRole("button", { name: /Save/i });

    // Simulate user typing into the department name field
    fireEvent.change(departmentInput, { target: { value: "HR" } });

    // Simulate a button click to submit the form
    fireEvent.click(submitButton);

    // Wait for async actions like API calls to complete
    await waitFor(() => expect(mockPostData).toHaveBeenCalledTimes(1));
    expect(mockPostData).toHaveBeenCalledTimes(1)

    // If you are testing the navigator on success or error, check that too
    expect(mockNavigator).not.toHaveBeenCalled(); // You can test navigation here if necessary
  });
});
