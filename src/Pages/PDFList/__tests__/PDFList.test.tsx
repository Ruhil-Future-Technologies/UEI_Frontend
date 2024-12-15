// import { render, screen, waitFor } from "@testing-library/react";
// import { BrowserRouter } from "react-router-dom";
// import "@testing-library/jest-dom";
// import React from "react";
// import PDFList from "../PDFList";
// import NameContext from "../../Context/NameContext";
// import { contextValue } from "../../../MockStorage/mockstorage";
// import useApi from "../../../hooks/useAPI";

// // Mocking the useApi hook properly
// jest.mock("../../../hooks/useAPI", () => ({
//   __esModule: true,
//   default: jest.fn(),
// }));

// const mockPostData = jest.fn();
// const mockPutData = jest.fn();
// const mockGetData = jest.fn();

// describe("PDF LIST COMPONENT", () => {
//   beforeEach(() => {
//     // Mock the `useApi` hook to return these methods
//     (useApi as jest.Mock).mockReturnValue({
//       getData: mockGetData,
//       postData: mockPostData,
//       putData: mockPutData,
//     });
//   });

//   it("should render PDFList component correctly", async () => {
//     // Mock `getData` to return a resolved promise
//     mockGetData.mockResolvedValue({
//       status: 200,
//       data: [{ class_name: "class_1", is_active: true }],
//     });

//     render(
//       <NameContext.Provider value={contextValue}>
//         <BrowserRouter>
//           <PDFList />
//         </BrowserRouter>
//       </NameContext.Provider>
//     );

//     // Wait for the API call to load the classes and ensure the class dropdown is rendered
//     await waitFor(() =>
//       expect(screen.getByTestId("class_text")).toBeInTheDocument()
//     );

//     await waitFor(() =>
//       expect(screen.getByTestId("class_text_input")).toBeInTheDocument()
//     );
//   });
// });
test('dummy test', () => {});