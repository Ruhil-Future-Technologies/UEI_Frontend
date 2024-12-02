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
import * as apiHook from "../../../hooks/useAPI";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

const mockedNavigate = jest.fn();

beforeEach(() => {
  (useLocation as jest.Mock).mockReturnValue({
    pathname: "localhost:3000/main/Language/add-Language",
  });
  (useParams as jest.Mock).mockReturnValue({ id: "12" }); // Mock 'id' consistently
  (useNavigate as jest.Mock).mockReturnValue(mockedNavigate); // Mock navigate function
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

  it("should handle form submission successfully in add mode", async () => {
    // Mock the postData function to track if it was called correctly
    const mockPostData = jest.fn().mockResolvedValue({
      status: 200,
      message: "Language created successfully",
    });
  
    // Mock apiHook's postData to use the mockPostData function
    jest.spyOn(apiHook, "default").mockReturnValue({
      postData: mockPostData,
      getData: jest.fn(),
      putData: jest.fn(),
      deleteData: jest.fn(),
      postFileData: jest.fn(),
      error: null,
    } as any);
  
    renderComponent();
  
    // Simulate a form submission with valid input
    fireEvent.change(screen.getByTestId("language_name"), {
      target: { value: "Spanish" },
    });
    fireEvent.click(screen.getByTestId("submitBtn"));
  
    // Wait for the mock postData to be called
    await waitFor(() => expect(mockPostData).toHaveBeenCalledWith(
      "https://qaapi.gyansetu.ai/language/add", // Ensure this URL is correct
      { language_name: "Spanish" } // Ensure this data matches what you are submitting
    ));
  
    // Check if success message is displayed
    expect(await screen.findByText("Language created successfully")).toBeInTheDocument();
  });  
});
