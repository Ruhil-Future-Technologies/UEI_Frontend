import { renderHook, act, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { httpClient } from "../../utils/http-client";
import useApi from "../useAPI";

// Mock the httpClient and useNavigate
jest.mock("../../utils/http-client", () => ({
  httpClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

describe("useApi getData Hook", () => {
  it("should return data correctly from getData", async () => {
    // Arrange: Mock the API response with correct type
    const mockData = { id: 1, name: "Test Menu" };
    (httpClient.get as jest.Mock).mockResolvedValue({ data: mockData });

    // Render the hook
    const { result } = renderHook(() => useApi(), {
      wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
    });

    // Act: Wrap async getData call in act()
    await act(async () => {
      await result.current.getData("https://api.example.com/menu");
    });

    // Wait for the async operation to complete using waitFor from @testing-library/react
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Assert: Check if the response matches the mock data
    expect(result.current.loading).toBe(false); // Check if loading is false after the request
    expect(result.current.error).toBe(null); // Ensure there was no error
    expect(httpClient.get).toHaveBeenCalledTimes(1); // Ensure getData was called once

    // Await the result of getData
    const data = await result.current.getData("https://api.example.com/menu");

    // Assert that the returned data matches the mock data
    expect(data).toEqual(mockData); // Compare the resolved data, not the promise
  });

  it("should throw error from getData", async () => {
    // Arrange: Mock the API to throw an error
    const mockError = new Error("Something went wrong");
    (httpClient.get as jest.Mock).mockRejectedValue(mockError);

    // Render the hook
    const { result } = renderHook(() => useApi(), {
      wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
    });

    // Act: Wrap async getData call in act()
    await act(async () => {
      try {
        await result.current.getData("https://api.example.com/menu");
      } catch (error) {
        // Catch the error to check that it's being thrown and handled
      }
    });

    // Wait for the async operation to complete and ensure loading is set to false
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Assert: Check if the error is set in the state
    expect(result.current.error).toEqual(mockError); // Ensure error is set correctly in the hook
    expect(result.current.loading).toBe(false); // Ensure loading is false after the request

    // Ensure getData was called once
    expect(httpClient.get).toHaveBeenCalledTimes(1);
  });
});

describe("useApi postData Hook", () => {
  it("should call postData hook correctly", async () => {
    // Arrange: Mock the API response with mock data for a successful post
    const mockData = { id: 1, name: "Test Menu" };
    (httpClient.post as jest.Mock).mockResolvedValue({ data: mockData });

    // Render the hook
    const { result } = renderHook(() => useApi(), {
      wrapper: BrowserRouter, // Wrap in BrowserRouter for useNavigate
    });

    // Act: Call postData with test data
    await act(async () => {
      const response = await result.current.postData(
        "https://api.example.com/menu",
        { name: "Test Menu" }
      );
      // Assert: Check if the response matches the mock data after awaiting the promise
      expect(response).toEqual(mockData); // Assert that the returned data matches the mock data
    });

    // Wait for the async operation to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Assert: Ensure that the post request was called with correct parameters
    expect(httpClient.post).toHaveBeenCalledTimes(1); // Ensure postData was called once
    expect(httpClient.post).toHaveBeenCalledWith(
      "https://api.example.com/menu",
      { name: "Test Menu" },
      { headers: expect.any(Object) }
    ); // Ensure correct data and headers were passed
    expect(result.current.error).toBe(null); // Ensure there was no error
    expect(result.current.loading).toBe(false); // Ensure loading is false after the request
  });
});
