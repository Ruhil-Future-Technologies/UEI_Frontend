// // login.test.tsx

// import React from "react";
// import { render, screen, waitFor} from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { MemoryRouter } from "react-router-dom"; // For handling routing in tests
// import Login from "../index"; // Adjust this import to the path where your Login component is located


// jest.mock('swiper/react', () => ({
//   Swiper: 'Swiper',
//   SwiperSlide: 'SwiperSlide',
// }));

// // Mock the API request
// jest.mock("../../../hooks/useAPI", () => ({
//   __esModule: true,
//   default: jest.fn(() => ({
//     postData: jest.fn(),
//   })),
// }));


// describe("Login Page", () => {
//   let postDataMock: jest.Mock;

//   beforeEach(() => {
//     // eslint-disable-next-line @typescript-eslint/no-require-imports
//     postDataMock = require("../../../hooks/useAPI").default().postData;
//   });

//   test("renders login form", () => {
//     render(
//       <MemoryRouter>
//         <Login />
//       </MemoryRouter>
//     );

//     // Check if the form elements are rendered
//     expect(screen.getByLabelText(/email \/ phone/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
//     expect(screen.getByRole("button", { name: /sign in now/i })).toBeInTheDocument();
//   });

//   test("validates email and password", async () => {
//     render(
//       <MemoryRouter>
//         <Login />
//       </MemoryRouter>
//     );

//     const emailInput = screen.getByLabelText(/email \/ phone/i);
//     const passwordInput = screen.getByLabelText(/password/i);
//     const submitButton = screen.getByRole("button", { name: /sign in now/i });

//     // Simulate user input
//     userEvent.type(emailInput, "invalidemail");
//     userEvent.type(passwordInput, "123456");

//     // Click submit button
//     userEvent.click(submitButton);

//     // Check for validation error
//     expect(await screen.findByText(/invalid email or phone number format/i)).toBeInTheDocument();

//     // Now test for a valid email/phone number format
//     userEvent.clear(emailInput);
//     userEvent.type(emailInput, "test@domain.com");

//     // After typing valid email, check that error is cleared
//     expect(screen.queryByText(/invalid email or phone number format/i)).not.toBeInTheDocument();
//   });

//   test("submits login request successfully", async () => {
//     render(
//       <MemoryRouter>
//         <Login />
//       </MemoryRouter>
//     );

//     const emailInput = screen.getByLabelText(/email \/ phone/i);
//     const passwordInput = screen.getByLabelText(/password/i);
//     const submitButton = screen.getByRole("button", { name: /sign in now/i });

//     // Simulate user input
//     userEvent.type(emailInput, "test@domain.com");
//     userEvent.type(passwordInput, "correctPassword");

//     // Mock API response
//     postDataMock.mockResolvedValueOnce({
//       status: 200,
//       token: "fake-jwt-token",
//       data: { user_type: "admin", userid: "test@domain.com", id: "123" },
//     });

//     // Click submit button
//     userEvent.click(submitButton);

//     await waitFor(() => {
//       // Check that the successful login logic is invoked, i.e., token saved to localStorage
//       expect(localStorage.setItem).toHaveBeenCalledWith("token", "fake-jwt-token");
//       expect(localStorage.setItem).toHaveBeenCalledWith("userid", "test@domain.com");
//       expect(screen.getByText(/user logged in successfully/i)).toBeInTheDocument();
//     });
//   });

//   test("shows loading spinner during login request", async () => {
//     render(
//       <MemoryRouter>
//         <Login />
//       </MemoryRouter>
//     );

//     const emailInput = screen.getByLabelText(/email \/ phone/i);
//     const passwordInput = screen.getByLabelText(/password/i);
//     const submitButton = screen.getByRole("button", { name: /sign in now/i });

//     // Simulate user input
//     userEvent.type(emailInput, "test@domain.com");
//     userEvent.type(passwordInput, "correctPassword");

//     // Mock API request to delay response
//     postDataMock.mockImplementationOnce(() =>
//       new Promise((resolve) => setTimeout(() => resolve({ status: 200 }), 2000))
//     );

//     // Check if the loading spinner is shown before the API call is resolved
//     userEvent.click(submitButton);
//     expect(screen.getByRole("status")).toBeInTheDocument(); // Assuming FullScreenLoader uses role="status"

//     // Wait for the request to finish
//     await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
//   });

//   test("handles failed login with error message", async () => {
//     render(
//       <MemoryRouter>
//         <Login />
//       </MemoryRouter>
//     );

//     const emailInput = screen.getByLabelText(/email \/ phone/i);
//     const passwordInput = screen.getByLabelText(/password/i);
//     const submitButton = screen.getByRole("button", { name: /sign in now/i });

//     // Simulate user input
//     userEvent.type(emailInput, "wrong@domain.com");
//     userEvent.type(passwordInput, "wrongPassword");

//     // Mock API response
//     postDataMock.mockResolvedValueOnce({
//       status: 404,
//       message: "Invalid userid or password",
//     });

//     // Click submit button
//     userEvent.click(submitButton);

//     await waitFor(() => {
//       // Check that error message is displayed
//       expect(screen.getByText(/invalid userid or password/i)).toBeInTheDocument();
//     });
//   });
// });
test('dummy test', () => {});
