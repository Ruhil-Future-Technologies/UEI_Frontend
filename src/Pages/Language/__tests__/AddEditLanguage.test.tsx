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
    renderComponent();
  
    // Fill in valid form data
    const languageNameInput = screen.getByTestId("language_name");
    const fileInput = screen.getByTestId("language_file");
    const descriptionInput = screen.getByTestId("language_description");
  
    // Simulate entering valid data for the language name, file, and description
    fireEvent.change(languageNameInput, { target: { value: "English" } });
    fireEvent.change(descriptionInput, { target: { value: "A widely spoken language." } });
  
    // Simulate file upload (mock file input)
    const mockFile = new File(["dummy content"], "dummy-image.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });
  
    // Submit the form
    fireEvent.click(screen.getByTestId("submitBtn"));
  
    // Assert that the button text is still "Save" because we're in add mode
    await screen.findByText("Update");
  
    // Check if handleSubmit has been triggered (mocked postData and other actions)
    expect(mockedNavigate).toHaveBeenCalledWith('/main/Language'); // Assuming successful navigation
  
    // If you are not sure about the exact success message, use waitFor to wait for a success message to appear
    await waitFor(() => {
      expect(screen.getByText(/language created successfully/i)).toBeInTheDocument();
    });
  
    // Verify that the form reset function was called to clear form data
    expect(screen.getByTestId("language_name")).toHaveValue(""); // Check if the field was reset
    expect(screen.getByTestId("language_description")).toHaveValue(""); // Check if description is reset
  });
  
  
   
});
