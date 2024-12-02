/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen,} from "@testing-library/react";
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
import { toast } from "react-toastify";



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
  // jest.mock('../../../hooks/useAPI'); // Mock the postData function
  jest.spyOn(toast, 'success');
  // it("should handle form submission successfully in add mode", async () => {
  //   render(<NameContext.Provider value={contextValue}>
  //     <BrowserRouter>
  //       <AddEditLanguage />
  //     </BrowserRouter>
  //   </NameContext.Provider>);
  
  //   // Fill in valid form data
  //   const languageNameInput = screen.getByTestId("language_name");
  //   const fileInput = screen.getByTestId("language_file");
  //   const descriptionInput = screen.getByTestId("language_description");
  
  //   // Simulate entering valid data for the language name, file, and description
  //   fireEvent.change(languageNameInput, { target: { value: "English" } });
  //   fireEvent.change(descriptionInput, { target: { value: "A widely spoken language." } });
  
  //   // Simulate file upload (mock file input)
  //   const mockFile = new File(["dummy content"], "dummy-image.png", { type: "image/png" });
  //   fireEvent.change(fileInput, { target: { files: [mockFile] } });
  
  //   // Mock the postData to simulate a successful API response
  //   // postData.mockResolvedValueOnce({
  //   //   status: 200,
  //   //   message: "Language created successfully"
  //   // });
  //   (useApi as jest.Mock).mockReturnValue({
  //     postData: jest.fn().mockResolvedValueOnce({
  //       status: 200,
  //       message: "Language created successfully"
  //     })
  //   });
  
  //   // Submit the form
  //   fireEvent.click(screen.getByTestId("submitBtn"));
  
  //   // Wait for the toast.success to be called
  //   await waitFor(() => {
  //     expect(toast.success).toHaveBeenCalledWith("Language created successfully", expect.any(Object));
  //   });
  
  //   // Verify that the form reset function was called to clear form data
  //   expect(screen.getByTestId("language_name")).toHaveValue(""); // Check if the field was reset
  //   expect(screen.getByTestId("language_description")).toHaveValue(""); // Check if description is reset
  // });
  
  
  
   
});
