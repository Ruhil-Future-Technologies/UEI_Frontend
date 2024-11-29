import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react";
import ChangePassword from "..";
import { BrowserRouter as Router } from "react-router-dom";
import { Formik } from "formik";

describe("Change Password Component", () => {
  it("should render the change password and confirm password field", () => {
    const { getByTestId } = render(
      <Router>
        <ChangePassword />
      </Router>
    );

    const passwordInput = getByTestId("new_password");
    const confirmPassInput = getByTestId("confirm_password");
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPassInput).toBeInTheDocument();
  });

  it("should show validation errors for empty fields on form submission", async () => {
    const { getAllByText, getByRole } = render(
      <Router>
        <ChangePassword />
      </Router>
    );

    const submitButton = getByRole("button", { name: /Reset Password/i });

    // Click on the submit button without entering any input
    fireEvent.click(submitButton);

    // Wait for validation errors to appear
    await waitFor(() => {
      const errorMessages = getAllByText("Please enter a password");
      expect(errorMessages).toHaveLength(2); // Check if there are 2 error messages
      errorMessages.forEach((message) => {
        expect(message).toBeInTheDocument(); // Verify each message is in the document
      });
    });
  });

  it("should show an error when passwords do not match", async () => {
    const { getByLabelText, getByRole, getByText } = render(
      <Router>
        <ChangePassword />
      </Router>
    );

    // Enter different passwords in the fields
    fireEvent.change(getByLabelText(/New Password/i), {
      target: { value: "Password123!" },
    });
    fireEvent.change(getByLabelText(/Confirm Password/i), {
      target: { value: "Password1234!" },
    });

    // Click submit
    fireEvent.click(getByRole("button", { name: /Reset Password/i }));

    // Wait for the mismatch error
    await waitFor(() => {
      expect(getByText("Password did not match.")).toBeInTheDocument();
    });
  });
});
