import { fireEvent, render } from "@testing-library/react";
import React from "react";
import AdminBasicInfo from "..";
import NameContext from "../../Context/NameContext";
import { contextValue } from "../../../MockStorage/mockstorage";
import { MemoryRouter } from "react-router-dom";
import dayjs from "dayjs";

describe("Admin Basic info Component", () => {
  // Mocking the required props
  const mockSetActiveForm = jest.fn();
  const mockActiveForm = 1; // Dummy value

  const renderedComponent = () => {
    return render(
      <NameContext.Provider value={contextValue}>
        <MemoryRouter>
          <AdminBasicInfo
            setActiveForm={mockSetActiveForm}
            activeForm={mockActiveForm}
          />
        </MemoryRouter>
      </NameContext.Provider>
    );
  };

  it("should render admin info fields correctly", () => {
    const { getByTestId, getByLabelText } = renderedComponent();
    const datePicker = getByLabelText("datepicker_label") as HTMLInputElement;

    expect(getByTestId("first_name")).toBeInTheDocument();
    expect(getByTestId("last_name")).toBeInTheDocument();
    expect(getByTestId("gender")).toBeInTheDocument();
    expect(datePicker).toBeInTheDocument();
    expect(getByTestId("father_name")).toBeInTheDocument();
    expect(getByTestId("mother_name")).toBeInTheDocument();
    expect(getByTestId("guardian_name")).toBeInTheDocument();
    expect(getByTestId("department_name")).toBeInTheDocument();
    expect(getByTestId("profile_image")).toBeInTheDocument();
    expect(getByTestId("next_button")).toBeInTheDocument();
  });

  it("should call handleInputChange function on input change", () => {
    const { getByTestId } = renderedComponent();

    // Find the input element by test ID
    const firstNameInput = getByTestId("first_name") as HTMLInputElement;
    const lastNameInput = getByTestId("last_name") as HTMLInputElement;

    // Get the male radio button and cast it to HTMLInputElement
    const gender = getByTestId("gender").querySelector(
      'input[value="male"]'
    ) as HTMLInputElement; // Cast to HTMLInputElement

    const father_name = getByTestId("father_name") as HTMLInputElement;
    const mother_name = getByTestId("mother_name") as HTMLInputElement;
    const guardian_name = getByTestId("guardian_name") as HTMLInputElement;

    // Simulate an onChange event
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Patel" } });

    // Ensure gender is not null and simulate a click event on the male radio button
    if (gender) {
      fireEvent.click(gender);
    }

    fireEvent.change(father_name, { target: { value: "father" } });
    fireEvent.change(mother_name, { target: { value: "mother" } });
    fireEvent.change(guardian_name, { target: { value: "guardian" } });

    // Check if the first_name value has been updated
    expect(firstNameInput.value).toBe("John");
    expect(lastNameInput.value).toBe("Patel");

    // Check if the gender radio button is selected
    if (gender) {
      expect(gender.checked).toBe(true); // Check the 'checked' property after firing the click
    }

    expect(father_name.value).toBe("father");
    expect(mother_name.value).toBe("mother");
    expect(guardian_name.value).toBe("guardian");
  });

  it("should call handleDateChange when DatePicker value changes", async () => {
    const { getByLabelText } = renderedComponent();

    const datePicker = getByLabelText("datepicker_label") as HTMLInputElement;
    const zeroPad = (num: number) => String(num).padStart(2, "0");
    const dayString = zeroPad(1);
    const monthString = zeroPad(1);
    const yearString = String(2001);
    const dateText = `${monthString}/${dayString}/${yearString}`;
    fireEvent.change(datePicker, { target: { value: dateText } });
    const datePickerValue = `${monthString}/${dayString}/${yearString}`;
    expect(datePicker.value).toBe(datePickerValue);
  });

  it("should call handleDateChange and give errors when DatePicker value changes for future dates or invalid dates", async () => {
    const { getByLabelText, getByText } = renderedComponent();

    // Get the date picker input
    const datePicker = getByLabelText("datepicker_label");

    // Test with a future date (future dates should show an error)
    const futureDate = dayjs().add(1, "year").format("DD/MM/YYYY");
    fireEvent.change(datePicker, { target: { value: futureDate } });

    // After changing to a future date, we expect the error message for future dates
    expect(getByText("Future dates are not allowed.")).toBeInTheDocument();

    // Test with a date where the person is younger than 6 years (should show age error)
    const youngerThanSixDate = dayjs()
      .subtract(5, "years")
      .format("DD/MM/YYYY");
    fireEvent.change(datePicker, { target: { value: youngerThanSixDate } });

    // After changing to a date where the person is younger than 6 years, we expect the age error
    expect(getByText("You must be at least 6 years old.")).toBeInTheDocument();
  });

  it("should update file preview when a valid image is selected", async () => {
    // Render the component
    const { getByTestId, findByAltText } = renderedComponent();

    // Get the file input element
    const fileInput = getByTestId("profile_image") as HTMLInputElement;

    // Create a mock file with a valid image type and size under 3MB
    const file = new File(["image content"], "valid-image.png", {
      type: "image/png",
    });

    // Create a mock of FileReader to simulate the onloadend event
    const fileReaderMock = {
      onloadend: jest.fn(),
      readAsDataURL: jest.fn(),
      result: "data:image/png;base64,exampledata", // Mocked file preview URL
      EMPTY: 0,
      LOADING: 1,
      DONE: 2,
    };

    // Override global FileReader with the mock implementation
    Object.defineProperty(global, "FileReader", {
      writable: true,
      value: jest.fn().mockImplementation(() => fileReaderMock),
    });

    // Trigger file selection
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });

    // Ensure FileReader's readAsDataURL is called with the file
    expect(fileReaderMock.readAsDataURL).toHaveBeenCalledWith(file);

    // Simulate the onloadend event after the file is read
    fileReaderMock.onloadend();

    // Wait for the file preview to update (findByAltText checks if the image is rendered)
    const filePreviewImage = (await findByAltText(
      "Uploaded Preview"
    )) as HTMLInputElement;

    // Ensure that the file preview has been set with the mock result
    expect(filePreviewImage.src).toBe(fileReaderMock.result);
  });
});
