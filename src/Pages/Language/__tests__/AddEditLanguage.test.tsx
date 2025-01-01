/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import AddEditLanguage from "../AddEditLanguage";
import NameContext from "../../Context/NameContext";
import {
  BrowserRouter,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { contextValue } from "../../../MockStorage/mockstorage";
import useApi from "../../../hooks/useAPI";
import { toast } from "react-toastify";
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock("../../../hooks/useAPI", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    postData: jest.fn().mockResolvedValueOnce({
      status: 200,
      message: "Language created successfully",
    }),
    getData: jest.fn(),
    putData: jest.fn(),
  }),
}));

const mockedNavigate = jest.fn();
const mockGetData = jest.fn();
const mockPostData = jest.fn().mockResolvedValueOnce({
  status: 200,
  message: "Language created successfully",
});

beforeEach(() => {
  (useLocation as jest.Mock).mockReturnValue({
    pathname: "localhost:3000/main/Language/add-Language",
  });
  mockGetData.mockReset();
  mockGetData.mockResolvedValue({
    data: { hobby_name: "Existing Hobby" },
  });
  (useParams as jest.Mock).mockReturnValue({ id: "" }); // Mock 'id' consistently
  (useNavigate as jest.Mock).mockReturnValue(mockedNavigate); // Mock navigate function

  // Mock the `useApi` hook to return the necessary functions
  (useApi as jest.Mock).mockReturnValue({
    getData: mockGetData,
    // getData: jest.fn(),
    postData: mockPostData,
    putData: jest.fn(),
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Add Edit Language Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <NameContext.Provider value={contextValue}>
        <BrowserRouter>
          <AddEditLanguage />
        </BrowserRouter>
      </NameContext.Provider>
    );

  it("renders correctly", () => {
    const { asFragment } = renderComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render the add edit language component with all fields properly", () => {
    renderComponent();
    expect(screen.getByTestId("language_name")).toBeInTheDocument();
    expect(screen.getByTestId("language_file")).toBeInTheDocument();
    expect(screen.getByTestId("language_description")).toBeInTheDocument();
    expect(screen.getByTestId("submitBtn")).toBeInTheDocument();
  });

  it("should display validation errors for empty form submission", async () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("submitBtn"));
    expect(
      await screen.findByText("Please enter Language name")
    ).toBeInTheDocument();
  });

  it("should display validation errors for invalid language_name", async () => {
    renderComponent();
    const input = screen.getByTestId("language_name");
    fireEvent.change(input, { target: { value: " " } }); // Add a space
    fireEvent.click(screen.getByTestId("submitBtn"));
    // Assert the validation error
    expect(
      await screen.findByText(
        "Please enter a valid Language name; whitespace is not allowed."
      )
    ).toBeInTheDocument();
  });

  it("displays success message on successful submit (Create)", async () => {
    (useParams as jest.Mock).mockReturnValue({ id: "" });
    mockPostData.mockResolvedValue({
      status: 200,
      message: "Language created successfully",
    });
    const { getByTestId } = renderComponent();
    const roleField = getByTestId("language_name") as HTMLElement;
    const saveButton = getByTestId("submitBtn") as HTMLElement;
    fireEvent.change(roleField, { target: { value: "New Language" } });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Language created successfully",
        expect.any(Object)
      );
    });
  });
});
