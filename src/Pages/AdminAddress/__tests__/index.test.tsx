import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import AdminAddress from "..";
import NameContext from "../../Context/NameContext";
import { contextValue } from "../../../MockStorage/mockstorage";
import { MemoryRouter } from "react-router-dom";

describe("Admin Address Component", () => {
  const setMockActiveForm = jest.fn();
  const MockActiveForm = 1;
  const testInputs = [
    { testId: "address1", newValue: "New Current Address" },
    { testId: "address2", newValue: "New Current Address 2" },
    { testId: "cityid", newValue: "Mumbai" },
    { testId: "districtid", newValue: "Mumbai" },
    { testId: "pincodeid", newValue: "000111" },
    { testId: "per_address1", newValue: "New Current Address" },
    { testId: "per_address2", newValue: "New Current Address 2" },
    { testId: "per_city", newValue: "Mumbai" },
    { testId: "per_district", newValue: "Mumbai" },
    { testId: "per_pincode", newValue: "000111" },
    { testId: "countryDropdown", newValue: "India" },
    { testId: "stateDropdown", newValue: "Gujarat" },
    { testId: "perCountryDropdown", newValue: "India" },
    { testId: "perStateDropdown", newValue: "Gujarat" },
  ];
  const renderComponent = () => {
    return render(
      <NameContext.Provider value={contextValue}>
        <MemoryRouter>
          <AdminAddress
            setActiveForm={setMockActiveForm}
            activeForm={MockActiveForm}
          />
        </MemoryRouter>
      </NameContext.Provider>
    );
  };

  it("should render admin adress component correctly", () => {
    const { getByTestId } = renderComponent();
    testInputs.forEach(({ testId }) => {
      const input = getByTestId(testId) as HTMLInputElement;
      expect(input).toBeInTheDocument();
    });
  });

  it("should handleInputChange function correctly", () => {
    const { getByTestId } = renderComponent();

    testInputs.forEach(({ testId, newValue }) => {
      const input = getByTestId(testId) as HTMLInputElement;
      fireEvent.change(input, { target: { value: newValue } });
      expect(input.value).toBe(newValue);
    });
  });

  it("should handle checking and unchecking the checkbox and update states", () => {
    const { getByTestId } = renderComponent();

    const checkbox = getByTestId("checkboxAddress") as HTMLInputElement;

    // Simulate checking the checkbox
    fireEvent.change(checkbox, { target: { checked: true } });

    // Check if the checked state has been updated to true
    expect(checkbox.checked).toBe(true);

    testInputs.forEach(({ testId, newValue }) => {
      const input = getByTestId(testId) as HTMLInputElement;
      fireEvent.change(input, { target: { value: newValue } });
      expect(input.value).toBe(newValue);
    });

    // Simulate unchecking the checkbox
    fireEvent.change(checkbox, { target: { checked: false } });

    // Check if the checked state has been updated to false
    expect(checkbox.checked).toBe(false);
    testInputs.forEach(({ testId }) => {
      const input = getByTestId(testId) as HTMLInputElement;
      fireEvent.change(input, { target: { value: "" } });
      expect(input.value).toBe("");
    });
  });

  it("should handle dropdown changes when handleInputChangecountry is triggered", () => {
    const { getByTestId } = renderComponent();
    // Simulate selecting a country
    const countryDropdown = getByTestId("countryDropdown") as HTMLInputElement;
    const stateDropdown = getByTestId("stateDropdown") as HTMLInputElement;
    fireEvent.change(countryDropdown, { target: { value: "India" } });
    fireEvent.change(stateDropdown, { target: { value: "Gujarat" } });
    expect(countryDropdown.value).toBe("India");
    expect(stateDropdown.value).toBe("Gujarat");
  });

  it("should call SubmitHandle function when submit button is clicked", async () => {
    const mockSubmitHandle = jest.fn(); // Mock the SubmitHandle function
    
    const { getByTestId } = renderComponent();
  
    // Get the submit button by its test ID
    const submitForm = getByTestId("submitForm") as HTMLButtonElement;
  
    // Mock the onClick handler if it's passed directly to the button
    submitForm.onclick = mockSubmitHandle;
  
    // Simulate clicking the submit button
    fireEvent.click(submitForm);
  
    // Wait for the mock function to be called
    await waitFor(() => {
      expect(mockSubmitHandle).toHaveBeenCalledTimes(1);
    });
  });  
});
