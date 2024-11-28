import React from "react";
import { render } from "@testing-library/react";
import ChangePassword from "..";
import { BrowserRouter as Router } from "react-router-dom";  // Use BrowserRouter instead of Router

describe("Change Password Component", () => {
  it("should render the change password field", () => {
    const { getByTestId } = render(
      <Router>
        <ChangePassword />
      </Router>
    );
    
    const passwordInput = getByTestId("new_password");
    expect(passwordInput).toBeInTheDocument();
  });
});

