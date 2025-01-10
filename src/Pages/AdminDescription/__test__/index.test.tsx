import { fireEvent, render } from "@testing-library/react";
import React from "react";
import NameContext from "../../Context/NameContext";
import { contextValue } from "../../../MockStorage/mockstorage";
import { MemoryRouter } from "react-router-dom";
import AdminDescription from "..";
import useApi from "../../../hooks/useAPI";
jest.mock('../../../hooks/useAPI', () => ({
    __esModule: true,
    default: jest.fn(() => ({
      getData: jest.fn(),
      postData: jest.fn(),
      putData: jest.fn(),
      postFileData:jest.fn()
    })),
  }));
  
  jest.mock('react-toastify', () => ({
    toast: {
      success: jest.fn(),
      error: jest.fn(),
    },
  }));

  const mockGetData = jest.fn();
    const mockPostData = jest.fn();
    const mockPutData = jest.fn();
    beforeEach(() => {
      mockPostData.mockReset();
      mockPutData.mockReset();
      (useApi as jest.Mock).mockImplementation(() => ({
        getData: mockGetData.mockResolvedValue({ getData: mockGetData }), // Mock resolved promise
        postData: mockPostData,
        putData: mockPutData, 
      }));
    });
describe("Admin Description page component", () => {

    const mockSetActiveForm = jest.fn();
    const mockActiveForm = 3;
    const renderedComponent=()=>{
        return render(<NameContext.Provider value={contextValue}>
            <MemoryRouter>
                <AdminDescription
                activeForm={mockActiveForm}
                setActiveForm={mockSetActiveForm}
                />
            </MemoryRouter>
        </NameContext.Provider>)
    }

    it("should render the page properly", () => {
        const {asFragment}=renderedComponent();
        expect(asFragment()).toMatchSnapshot();
    });

    it("should render the fileds correctly", () => {
        const {getByTestId}=renderedComponent();
        const description=getByTestId("description");
        expect(description).toBeInTheDocument();
    });

    it("should handlecahnges function working at onchange ",()=>{
        const {getByLabelText}=renderedComponent();
        const descriptionInput=getByLabelText("Description *") as HTMLInputElement;
        fireEvent.change(descriptionInput, {target: {value: "New Description"}});
        expect(descriptionInput.value).toBe("New Description");
    })

   
})