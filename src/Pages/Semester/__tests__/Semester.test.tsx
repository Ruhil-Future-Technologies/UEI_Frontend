import { render, screen, waitFor } from "@testing-library/react";
import Semester from "../Semester";
import React from "react";
import NameContext from "../../Context/NameContext";
import { contextValue } from "../../../MockStorage/mockstorage";
import { MemoryRouter } from "react-router-dom";
import useApi from "../../../hooks/useAPI";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("../../../hooks/useAPI", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockPostData = jest.fn();
const mockPutData = jest.fn().mockResolvedValue({
  data: [
    {
      course_id: 132,
      course_name: "testing cet2",
      created_at: "Thu, 21 Nov 2024 15:23:37 GMT",
      created_by: "Admin",
      institution_id: 178,
      institution_name: "Sree Chithira Thirunal CET",
      is_active: 1,
      semester_id: 838,
      semester_number: 1,
      updated_at: "Thu, 21 Nov 2024 15:23:37 GMT",
      updated_by: "Admin",
    },
  ],
});
const mockGetData = jest.fn();
describe("Semester component", () => {
  beforeEach(() => {
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
  it("should render semester component correctly", async () => {
    render(
      <NameContext.Provider value={contextValue}>
        <MemoryRouter>
          <Semester />
        </MemoryRouter>
      </NameContext.Provider>
    );

    // Wait for component to finish rendering
    await waitFor(() => screen.getByTestId("sem_label"));

    expect(screen.getByTestId("sem_label")).toBeInTheDocument();
    expect(screen.getByTestId("semster_btn")).toBeInTheDocument();
  });
});
