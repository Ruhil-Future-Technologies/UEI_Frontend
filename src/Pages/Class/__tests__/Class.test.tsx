import { render, screen } from "@testing-library/react";
import React from "react";
import NameContext from "../../Context/NameContext";
import { contextValue, mockClassValue } from "../../../MockStorage/mockstorage";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import Class from "../Class";
import useApi from "../../../hooks/useAPI";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("../../../hooks/useAPI", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    getData: jest.fn().mockResolvedValueOnce(mockClassValue),
    deleteData: jest.fn().mockResolvedValueOnce({
      message: "Class Deleted Successfully",
      status: 200,
    }),
    loading: false,
  }),
}));

const mockedNavigate = jest.fn();
const mockGetData = jest.fn().mockResolvedValueOnce(mockClassValue);
const mockDeleteData = jest.fn().mockResolvedValueOnce({
  message: "Class Deleted Successfully",
  status: 200,
});

beforeEach(() => {
  (useLocation as jest.Mock).mockReturnValue({
    pathname: "http://localhost:3000/main/Class",
  });
  mockGetData.mockReset();
  mockGetData.mockResolvedValue(mockClassValue);
  (mockDeleteData as jest.Mock).mockReset();
  (mockDeleteData as jest.Mock).mockResolvedValueOnce({
    message: "Class Deleted Successfully",
    status: 200,
  });
  (useNavigate as jest.Mock).mockReturnValue(mockedNavigate); // Mock navigate function
  (useApi as jest.Mock).mockReturnValue({
    getData: mockGetData,
    deleteData: mockDeleteData,
    loading: false,
  });
});

describe("Class Component", () => {
  const renderedComponent = () => {
    return render(
      <NameContext.Provider value={contextValue}>
        <MemoryRouter>
          <Class />
        </MemoryRouter>
      </NameContext.Provider>
    );
  };

  it("renders correctly", () => {
    const { asFragment } = renderedComponent();
    expect(asFragment()).toMatchSnapshot();
  });
  
  it("should render class component correctly", () => {
    const { getByText } = renderedComponent();
    expect(getByText("Class")).toBeInTheDocument();
  });

  it("should render table headers", () => {
    renderedComponent();
    const tableHeaders = screen.getAllByRole("columnheader", {
      name: /Actions|Class name|Created By|Created At|Updated By|Last Updated At/i,
    });
    expect(tableHeaders.length).toBe(6); // Adjust the expected number if necessary
  });
});
