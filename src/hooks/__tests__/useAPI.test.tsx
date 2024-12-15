// import { renderHook, act, waitFor } from "@testing-library/react";
// import { BrowserRouter } from "react-router-dom";
// import { httpClient } from "../../utils/http-client";
// import useApi from "../useAPI";

// // Mock the httpClient and useNavigate
// jest.mock("../../utils/http-client", () => ({
//   httpClient: {
//     get: jest.fn(),
//     post: jest.fn(),
//     put: jest.fn(),
//     patch: jest.fn(),
//     delete: jest.fn(),
//   },
// }));

// jest.mock("react-router-dom", () => ({
//   useNavigate: jest.fn(),
// }));

// describe("useApi getData Hook", () => {
//   it("should return data correctly from getData", async () => {
//     // Arrange: Mock the API response with correct type
//     const mockData = { id: 1, name: "Test Menu" };
//     (httpClient.get as jest.Mock).mockResolvedValue({ data: mockData });

//     // Render the hook
//     const { result } = renderHook(() => useApi(), {
//       wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
//     });

//     // Act: Wrap async getData call in act()
//     await act(async () => {
//       await result.current.getData("https://api.example.com/menu");
//     });

//     // Wait for the async operation to complete using waitFor from @testing-library/react
//     await waitFor(() => expect(result.current.loading).toBe(false));

//     // Assert: Check if the response matches the mock data
//     expect(result.current.loading).toBe(false); // Check if loading is false after the request
//     expect(result.current.error).toBe(null); // Ensure there was no error
//     expect(httpClient.get).toHaveBeenCalledTimes(1); // Ensure getData was called once

//     // Await the result of getData
//     const data = await result.current.getData("https://api.example.com/menu");

//     // Assert that the returned data matches the mock data
//     expect(data).toEqual(mockData); // Compare the resolved data, not the promise
//   });

//   it("should throw error from getData", async () => {
//     // Arrange: Mock the API to throw an error
//     const mockError = new Error("Something went wrong");
//     (httpClient.get as jest.Mock).mockRejectedValue(mockError);

//     // Render the hook
//     const { result } = renderHook(() => useApi(), {
//       wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
//     });

//     // Act: Wrap async getData call in act()
//     await act(async () => {
//       try {
//         await result.current.getData("https://api.example.com/menu");
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       } catch (_error: unknown) {
//         // Catch the error to check that it's being thrown and handled
//       }
//     });

//     // Wait for the async operation to complete and ensure loading is set to false
//     await waitFor(() => expect(result.current.loading).toBe(false));

//     // Assert: Check if the error is set in the state
//     expect(result.current.error).toEqual(mockError); // Ensure error is set correctly in the hook
//     expect(result.current.loading).toBe(false); // Ensure loading is false after the request

//     // Ensure getData was called once
//     expect(httpClient.get).toHaveBeenCalledTimes(1);
//   });
// });

// describe("useApi postData Hook", () => {
//   it("should call postData hook correctly", async () => {
//     // Arrange: Mock the API response with mock data for a successful post
//     const mockData = { id: 1, name: "Test Menu" };
//     (httpClient.post as jest.Mock).mockResolvedValue({ data: mockData });

//     // Render the hook
//     const { result } = renderHook(() => useApi(), {
//       wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
//     });

//     // Act: Call postData with test data
//     await act(async () => {
//       const response = await result.current.postData(
//         "https://api.example.com/menu",
//         { name: "Test Menu" }
//       );
//       // Assert: Check if the response matches the mock data after awaiting the promise
//       expect(response).toEqual(mockData); // Assert that the returned data matches the mock data
//     });

//     // Wait for the async operation to complete
//     await waitFor(() => expect(result.current.loading).toBe(false));

//     // Assert: Ensure that the post request was called with correct parameters
//     expect(httpClient.post).toHaveBeenCalledTimes(1); // Ensure postData was called once
//     expect(httpClient.post).toHaveBeenCalledWith(
//       "https://api.example.com/menu",
//       { name: "Test Menu" },
//       { headers: expect.any(Object) }
//     ); // Ensure correct data and headers were passed
//     expect(result.current.error).toBe(null); // Ensure there was no error
//     expect(result.current.loading).toBe(false); // Ensure loading is false after the request
//   });

//   it("should throw error from postData", async () => {
//     // Arrange: Mock the API to throw an error
//     const mockError = new Error("Something went wrong");
//     (httpClient.post as jest.Mock).mockRejectedValue(mockError);

//     // Render the hook
//     const { result } = renderHook(() => useApi(), {
//       wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
//     });

//     // Act: Wrap async getData call in act()
//     await act(async () => {
//       try {
//         await result.current.postData("https://api.example.com/menu");
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       } catch (error) {
//         // Catch the error to check that it's being thrown and handled
//       }
//     });

//     // Wait for the async operation to complete and ensure loading is set to false
//     await waitFor(() => expect(result.current.loading).toBe(false));

//     // Assert: Check if the error is set in the state
//     expect(result.current.error).toEqual(mockError); // Ensure error is set correctly in the hook
//     expect(result.current.loading).toBe(false); // Ensure loading is false after the request

//     // Ensure getData was called once
//     expect(httpClient.post).toHaveBeenCalledTimes(1);
//   });
// });


// describe("useApi putData Hook", () => {
//   it("should call putData hook correctly", async () => {
//     // Arrange: Mock the API response with mock data for a successful PUT request
//     const mockData = { id: 1, name: "Test Menu" };
//     (httpClient.put as jest.Mock).mockResolvedValue({ data: mockData });

//     // Render the hook
//     const { result } = renderHook(() => useApi(), {
//       wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
//     });

//     // Act: Call putData with test data
//     await act(async () => {
//       const response = await result.current.putData(
//         "https://api.example.com/menu",
//         { name: "Test Menu" }
//       );
//       // Assert: Check if the response matches the mock data after awaiting the promise
//       expect(response).toEqual(mockData); // Assert that the returned data matches the mock data
//     });

//     // Wait for the async operation to complete
//     await waitFor(() => expect(result.current.loading).toBe(false));

//     // Assert: Ensure that the PUT request was called with correct parameters
//     expect(httpClient.put).toHaveBeenCalledTimes(1); // Ensure putData was called once
//     expect(httpClient.put).toHaveBeenCalledWith(
//       "https://api.example.com/menu",
//       '{"name":"Test Menu"}', // Expect stringified data here
//       { headers: expect.any(Object) } // Ensure correct headers were passed
//     );

//     // Assert: Ensure there was no error
//     expect(result.current.error).toBe(null); // Ensure there was no error
//     expect(result.current.loading).toBe(false); // Ensure loading is false after the request
//   });


//   it("should throw error from putData", async () => {
//     // Arrange: Mock the API to throw an error
//     const mockError = new Error("Something went wrong");
//     (httpClient.put as jest.Mock).mockRejectedValue(mockError);

//     // Render the hook
//     const { result } = renderHook(() => useApi(), {
//       wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
//     });

//     // Act: Wrap async getData call in act()
//     await act(async () => {
//       try {
//         await result.current.putData("https://api.example.com/menu");
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       } catch (error) {
//         // Catch the error to check that it's being thrown and handled
//       }
//     });

//     // Wait for the async operation to complete and ensure loading is set to false
//     await waitFor(() => expect(result.current.loading).toBe(false));

//     // Assert: Check if the error is set in the state
//     expect(result.current.error).toEqual(mockError); // Ensure error is set correctly in the hook
//     expect(result.current.loading).toBe(false); // Ensure loading is false after the request

//     // Ensure getData was called once
//     expect(httpClient.put).toHaveBeenCalledTimes(1);
//   });
// });
// //

// describe("useApi deleteData Hook", () => {
//   it("should call deleteData hook correctly", async () => {
//     const mockData = { id: 1, name: "Test Menu" };
//     (httpClient.delete as jest.Mock).mockResolvedValue({ data: mockData });

//     const { result } = renderHook(() => useApi(), {
//       wrapper: BrowserRouter,
//     });

//     await act(async () => {
//       const response = await result.current.deleteData(
//         `https://api.example.com/menu/${1}`,
//       );

//       // Assert that the response is correct
//       expect(response).toEqual(mockData);
//     });

//     await waitFor(() => expect(result.current.loading).toBe(false));
//     expect(httpClient.delete).toHaveBeenCalledTimes(1);
//     expect(httpClient.delete).toHaveBeenCalledWith(
//       `https://api.example.com/menu/${1}`,
//       { headers: expect.any(Object) }
//     );
//     expect(result.current.error).toBe(null);
//     expect(result.current.loading).toBe(false);
//   });

//   it("should throw error from deleteData", async () => {
//     // Arrange: Mock the API to throw an error
//     const mockError = new Error("Something went wrong");
//     (httpClient.delete as jest.Mock).mockRejectedValue(mockError);

//     // Render the hook
//     const { result } = renderHook(() => useApi(), {
//       wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
//     });

//     // Act: Wrap async getData call in act()
//     await act(async () => {
//       try {
//         await result.current.deleteData(`https://api.example.com/menu/${1}`);
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       } catch (error) {
//         // Catch the error to check that it's being thrown and handled
//       }
//     });

//     // Wait for the async operation to complete and ensure loading is set to false
//     await waitFor(() => expect(result.current.loading).toBe(false));

//     // Assert: Check if the error is set in the state
//     expect(result.current.error).toEqual(mockError); // Ensure error is set correctly in the hook
//     expect(result.current.loading).toBe(false); // Ensure loading is false after the request

//     // Ensure getData was called once
//     expect(httpClient.delete).toHaveBeenCalledTimes(1);
//   });

// });

// describe("useApi postFileData Hook", () => {
//   it("should call postFileData hook correctly", async () => {
//     // Arrange: Mock the API response with mock data for a successful post
//     const mockData = { id: 1, name: "Test Menu" };
//     (httpClient.post as jest.Mock).mockResolvedValue({ data: mockData });

//     // Render the hook
//     const { result } = renderHook(() => useApi(), {
//       wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
//     });

//     // Act: Call postData with test data
//     await act(async () => {
//       const response = await result.current.postFileData(
//         "https://api.example.com/menu",
//         { name: "Test Menu" }
//       );
//       // Assert: Check if the response matches the mock data after awaiting the promise
//       expect(response).toEqual(mockData); // Assert that the returned data matches the mock data
//     });

//     // Wait for the async operation to complete
//     await waitFor(() => expect(result.current.loading).toBe(false));

//     // Assert: Ensure that the post request was called with correct parameters
//     expect(httpClient.post).toHaveBeenCalledTimes(1); // Ensure postData was called once
//     expect(httpClient.post).toHaveBeenCalledWith(
//       "https://api.example.com/menu",
//       { name: "Test Menu" },
//       { headers: expect.any(Object) }
//     ); // Ensure correct data and headers were passed
//     expect(result.current.error).toBe(null); // Ensure there was no error
//     expect(result.current.loading).toBe(false); // Ensure loading is false after the request
//   });

//   it("should throw error from postFileData", async () => {
//     // Arrange: Mock the API to throw an error
//     const mockError = new Error("Something went wrong");
//     (httpClient.post as jest.Mock).mockRejectedValue(mockError);

//     // Render the hook
//     const { result } = renderHook(() => useApi(), {
//       wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
//     });

//     // Act: Wrap async getData call in act()
//     await act(async () => {
//       try {
//         await result.current.postFileData("https://api.example.com/menu");
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       } catch (error) {
//         // Catch the error to check that it's being thrown and handled
//       }
//     });

//     // Wait for the async operation to complete and ensure loading is set to false
//     await waitFor(() => expect(result.current.loading).toBe(false));

//     // Assert: Check if the error is set in the state
//     expect(result.current.error).toEqual(mockError); // Ensure error is set correctly in the hook
//     expect(result.current.loading).toBe(false); // Ensure loading is false after the request

//     // Ensure getData was called once
//     expect(httpClient.post).toHaveBeenCalledTimes(1);
//   });
// });
// describe("useApi deleteFileData Hook", () => {
//   it("should call deleteFileData hook correctly", async () => {
//     // Arrange: Mock the API response with mock data for a successful post
//     const mockData = { id: 1, name: "Test Menu" };
//     (httpClient.delete as jest.Mock).mockResolvedValue({ data: mockData });

//     // Render the hook
//     const { result } = renderHook(() => useApi(), {
//       wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
//     });

//     // Act: Call deleteFileData with test data
//     await act(async () => {
//       const response = await result.current.deleteFileData(
//         `https://api.example.com/menu/${1}`,
//         { name: "Test Menu" }
//       );
//       // Assert: Check if the response matches the mock data after awaiting the promise
//       expect(response).toEqual(mockData); // Assert that the returned data matches the mock data
//     });

//     // Wait for the async operation to complete
//     await waitFor(() => expect(result.current.loading).toBe(false));

//     // Assert: Ensure that the delete request was called with correct parameters
//     expect(httpClient.delete).toHaveBeenCalledTimes(1); // Ensure deleteData was called once
//     expect(httpClient.delete).toHaveBeenCalledWith(
//       `https://api.example.com/menu/${1}`,
//       {
//         data: JSON.stringify({ name: "Test Menu" }),
//         headers: expect.objectContaining({
//           Authorization: "null", // Explicitly checking for Authorization being null
//         }),
//       }
//     );
//     expect(result.current.error).toBe(null); // Ensure there was no error
//     expect(result.current.loading).toBe(false); // Ensure loading is false after the request
//   });


//   it("should throw error from postFileData", async () => {
//     // Arrange: Mock the API to throw an error
//     const mockError = new Error("Something went wrong");
//     (httpClient.delete as jest.Mock).mockRejectedValue(mockError);

//     // Render the hook
//     const { result } = renderHook(() => useApi(), {
//       wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
//     });

//     // Act: Wrap async getData call in act()
//     await act(async () => {
//       try {
//         await result.current.deleteFileData("https://api.example.com/menu");
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       } catch (error) {
//         // Catch the error to check that it's being thrown and handled
//       }
//     });

//     // Wait for the async operation to complete and ensure loading is set to false
//     await waitFor(() => expect(result.current.loading).toBe(false));

//     // Assert: Check if the error is set in the state
//     expect(result.current.error).toEqual(mockError); // Ensure error is set correctly in the hook
//     expect(result.current.loading).toBe(false); // Ensure loading is false after the request

//     // Ensure getData was called once
//     expect(httpClient.delete).toHaveBeenCalledTimes(1);
//   });
// });
test('dummy test', () => {});

