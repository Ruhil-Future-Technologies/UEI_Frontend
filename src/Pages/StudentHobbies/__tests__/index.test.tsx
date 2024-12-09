import React from "react";
import StudentHobbies from "..";
import { fireEvent, render, waitFor } from "@testing-library/react";
import NameContext from "../../Context/NameContext";
import { BrowserRouter } from "react-router-dom";
import { contextValue } from "../../../MockStorage/mockstorage";
import useApi from "../../../hooks/useAPI";

jest.mock("../../../hooks/useAPI");
describe("Student Hobbies Compontent", () => {
  const mockGetData = jest.fn();
  const mockPostData = jest.fn();
  const mockPutData = jest.fn();
  const mockDeleteData = jest.fn();

  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue({
      getData: mockGetData,
      postData: mockPostData,
      putData: mockPutData,
      deleteData: mockDeleteData,
    });
  });
  it("should render the student hobbies component", () => {
    const { getByTestId } = render(
      <NameContext.Provider value={contextValue}>
        <BrowserRouter>
          <StudentHobbies
            save={false}
            setSave={() => {}}
            setIsHobbiesUpdated={() => {}}
            isLanguageUpdated={false}
          />
        </BrowserRouter>
      </NameContext.Provider>
    );
    expect(getByTestId("hobby_text")).toBeInTheDocument();
  });

  it("should fetch and display hobbies", async () => {
    mockGetData.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, hobby_name: "Reading", is_active: 1 },
        { id: 2, hobby_name: "Gaming", is_active: 1 },
      ],
    });

    const { getByLabelText, getByText } = render(
      <NameContext.Provider value={contextValue}>
        <BrowserRouter>
          <StudentHobbies
            save={false}
            setSave={() => {}}
            setIsHobbiesUpdated={() => {}}
            isLanguageUpdated={false}
          />
        </BrowserRouter>
      </NameContext.Provider>
    );

    const select = getByLabelText("Hobby"); // Matches the label associated with the Select
    fireEvent.mouseDown(select); // Opens the dropdown

    await waitFor(() => {
      expect(getByText("Reading")).toBeInTheDocument();
      expect(getByText("Gaming")).toBeInTheDocument();
    });
  });

  it("should fetch and display hobbies", async () => {
    mockGetData.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, hobby_name: "Reading", is_active: 1 },
        { id: 2, hobby_name: "Gaming", is_active: 1 },
      ],
    });

    const { getByLabelText, getByText, getAllByRole } = render(
      <NameContext.Provider value={contextValue}>
        <BrowserRouter>
          <StudentHobbies
            save={false}
            setSave={() => {}}
            setIsHobbiesUpdated={() => {}}
            isLanguageUpdated={false}
          />
        </BrowserRouter>
      </NameContext.Provider>
    );

    const select = getByLabelText("Hobby"); // Matches the label associated with the Select
    fireEvent.mouseDown(select); // Opens the dropdown

    // Wait for the dropdown items to appear
    await waitFor(() => expect(getByText("Reading")).toBeInTheDocument());
    await waitFor(() => expect(getByText("Gaming")).toBeInTheDocument());

    // Query all checkboxes inside the dropdown (this should match if you're using Material-UI Checkboxes)
    const checkboxes = getAllByRole("checkbox");
    expect(checkboxes.length).toBe(2); // Ensure two checkboxes are rendered

    // Find the "Reading" checkbox and click it
    const readingCheckbox = checkboxes[0];
    fireEvent.click(readingCheckbox);

    // Verify that the checkbox is checked after the click
    expect(readingCheckbox).toBeChecked();
  });
});
