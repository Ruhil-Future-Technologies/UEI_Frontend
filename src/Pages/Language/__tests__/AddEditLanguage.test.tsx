/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen } from "@testing-library/react";
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
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedNavigate = jest.fn();
const mockPostData = jest.fn().mockResolvedValueOnce({
  status: 200,
  message: "Language created successfully",
});

beforeEach(() => {
  (useLocation as jest.Mock).mockReturnValue({
    pathname: "localhost:3000/main/Language/add-Language",
  });
  (useParams as jest.Mock).mockReturnValue({ id: "12" }); // Mock 'id' consistently
  (useNavigate as jest.Mock).mockReturnValue(mockedNavigate); // Mock navigate function

  // Mock the `useApi` hook to return the necessary functions
  (useApi as jest.Mock).mockReturnValue({
    getData: jest.fn(),
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

  // it("should handle form submission successfully in add mode", async () => {
  //   const mockPostData = jest.fn().mockResolvedValueOnce({
  //     status: 200,
  //     message: "Language created successfully",
  //   });

  //   (useApi as jest.Mock).mockReturnValue({
  //     postData: mockPostData,
  //     getData: jest.fn(),
  //     putData: jest.fn(),
  //   });

  //   render(
  //     <NameContext.Provider value={contextValue}>
  //       <BrowserRouter>
  //         <AddEditLanguage />
  //       </BrowserRouter>
  //     </NameContext.Provider>
  //   );

  //   // Fill in valid form data
  //   const languageNameInput = screen.getByTestId("language_name");
  //   const fileInput = screen.getByTestId("language_file");
  //   const descriptionInput = screen.getByTestId("language_description");

  //   fireEvent.change(languageNameInput, { target: { value: "English" } });
  //   fireEvent.change(descriptionInput, {
  //     target: { value: "A widely spoken language." },
  //   });

  //   // Simulate file upload
  //   const mockFile = new File(["dummy content"], "dummy-image.png", {
  //     type: "image/png",
  //   });
  //   fireEvent.change(fileInput, { target: { files: [mockFile] } });

  //   // Simulate form submission
  //   fireEvent.click(screen.getByTestId("submitBtn"));

  //   // Wait for toast.success to be called and ensure it's called once
  //   await waitFor(() => {
  //     expect(toast.success).toHaveBeenCalledTimes(1); // Ensure it's called only once
  //     expect(toast.success).toHaveBeenCalledWith(
  //       "Language created successfully",
  //       expect.any(Object)
  //     );
  //   });

  //   // Verify the form is reset
  //   expect(screen.getByTestId("language_name")).toHaveValue("");
  //   expect(screen.getByTestId("language_description")).toHaveValue("");

  //   // Ensure postData was called with the correct parameters
  //   expect(mockPostData).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       language_name: "English",
  //       description: "A widely spoken language.",
  //       file: expect.any(File),
  //     })
  //   );
  // });
});
