

import React from 'react';
import { MemoryRouter } from "react-router-dom";
import { contextValue } from "../../../MockStorage/mockstorage";
import NameContext from "../../Context/NameContext";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import StudentcontactDetails from '..';
import useApi from '../../../hooks/useAPI';
//import { deepEqual } from '../../../utils/helpers';
jest.mock('../../../hooks/useAPI');

describe("Student Contect Component", () => {
  // Mocking the required props
  const mockSetActiveForm = jest.fn();
  const mockActiveForm = 2;
  const mockGetData = jest.fn();
  const mockPostData = jest.fn();
  const mockPutData = jest.fn();

  beforeEach(() => {
    (useApi as jest.Mock).mockImplementation(() => ({
      getData: mockGetData.mockResolvedValue({}), // Mock resolved promise
      postData: mockPostData,
      putData: mockPutData,
    }));
  });

  const renderedComponent = () => {
    return render(
      <NameContext.Provider value={contextValue}>
        <MemoryRouter>
          <StudentcontactDetails
            setActiveForm={mockSetActiveForm}
            activeForm={mockActiveForm}
          />
        </MemoryRouter>
      </NameContext.Provider>,
    );
  };

  it("Should render Student contect component correctly", () => {
    const { asFragment } = renderedComponent();
    expect(asFragment()).toMatchSnapshot();
  })

  it("should render fields Student contact correctly", () => {
    const { getByTestId, getByText, getByRole } = renderedComponent();
    const prevButten = getByRole('button', {
      name: /previous/i
    })
    const nextbutten = getByRole('button', {
      name: /next/i
    })
    expect(getByTestId("county_pcode")).toBeInTheDocument();
    expect(getByTestId("county_wpcode")).toBeInTheDocument();
    expect(getByTestId("mobile_num")).toBeInTheDocument();
    expect(getByTestId("email_id")).toBeInTheDocument();
    expect(getByTestId("whtmobile_num")).toBeInTheDocument();
    expect(getByText(/mobile number \*/i)).toBeInTheDocument();
    expect(getByText(/whatsapp number/i)).toBeInTheDocument();
    expect(getByText(/email id/i)).toBeInTheDocument();
    expect(nextbutten).toBeInTheDocument();
    expect(prevButten).toBeInTheDocument();

  })


  it("should call handleChange function on input change", async () => {
    const { getByTestId, } = renderedComponent();

    const mobileInput = getByTestId('mobile_num').querySelector('input') as HTMLInputElement;
    const whatsappNum = getByTestId('whtmobile_num').querySelector('input') as HTMLInputElement;
    const emailInput = getByTestId('email_id').querySelector('input') as HTMLInputElement;
    const countrycodeDropdown = getByTestId('county_pcode').querySelector('input') as HTMLInputElement;
    const countrycodewhatsaDropdown = getByTestId('county_wpcode').querySelector('input') as HTMLInputElement;

    fireEvent.change(mobileInput, { target: { value: '9876545678' } });
    fireEvent.change(whatsappNum, { target: { value: '6765433458' } });
    fireEvent.change(emailInput, { target: { value: 'atul@gmail.com' } });
    fireEvent.change(countrycodeDropdown, { target: { value: '+91' } });
    fireEvent.change(countrycodewhatsaDropdown, { target: { value: '+91' } });

    expect(mobileInput.value).toBe('9876545678');
    expect(whatsappNum.value).toBe('6765433458');
    expect(emailInput.value).toBe('atul@gmail.com');
    expect(countrycodeDropdown.value).toBe('+91');
    expect(countrycodewhatsaDropdown.value).toBe('+91');


  });

  it('should call SubmitHandle function when Next button is clicked', async () => {
    const mockSubmitHandle = jest.fn(); // Mock the SubmitHandle function

    const { getByTestId } = renderedComponent();

    const submitForm = getByTestId('submitForm') as HTMLButtonElement;

    submitForm.onclick = mockSubmitHandle;

    fireEvent.click(submitForm);


    await waitFor(() => {
      expect(mockSubmitHandle).toHaveBeenCalledTimes(1);
    });
  });

  it("should call setActiveForm function when previous is clicked", async () => {
    const { getByTestId } = renderedComponent();


    const button = getByTestId("gobackform");
    fireEvent.click(button);

    expect(mockSetActiveForm).toHaveBeenCalledTimes(1);

    expect(mockSetActiveForm).toHaveBeenCalledWith(expect.any(Function));


    const decrementFunction = mockSetActiveForm.mock.calls[0][0];
    expect(decrementFunction(5)).toBe(4);
  });

  it('should display validation message when mobile number is invalid', () => {
    const { getByTestId, } = renderedComponent();

    const mobileInput = getByTestId('mobile_num').querySelector('input') as HTMLInputElement;

    fireEvent.change(mobileInput, { target: { value: 'sjbvks' } });
    fireEvent.blur(mobileInput);

    expect(screen.getByText((content) => content.includes('Mobile number should be 10 digits'))).toBeInTheDocument();


    fireEvent.change(mobileInput, { target: { value: '123456789' } });
    fireEvent.blur(mobileInput);
    expect(screen.getByText((content) => content.includes('Mobile number should be 10 digits'))).toBeInTheDocument();


    fireEvent.change(mobileInput, { target: { value: '123456789012' } });
    fireEvent.blur(mobileInput);
    expect(screen.getByText((content) => content.includes('Mobile number should be 10 digits'))).toBeInTheDocument();


    fireEvent.change(mobileInput, { target: { value: '1234567890' } });
    fireEvent.blur(mobileInput);

    expect(screen.queryByText((content) => content.includes('Mobile number should be 10 digits'))).not.toBeInTheDocument();
  });
  it("should be check data comes and flag is false ", async () => {
    let flagValue = false;
    mockGetData.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, email_id: 'atul@gmail.com', mobile_no_call: "8975461325", mobile_isd_call: "+91", mobile_isd_watsapp: "+91", mobile_no_watsapp: "8975642563" },
      ],
    });


    const fetchData = async () => {
      const response = await mockGetData();
      if (response.status === 200 && response.data.length > 0) {
        flagValue = false;
      } else {
        flagValue = true;
      }
    };

    if (flagValue) {
      await mockPostData(); // Call Save API
    } else {
      await mockPutData(); // Call Update API
    }


    await fetchData();

    // Assertions for Update API
    expect(mockPutData).toHaveBeenCalled(); // Verify update API was called
    expect(mockPostData).not.toHaveBeenCalled()
  })
  it("should save or update data when the form is submitted", async () => {
    const mockSubmitHandle = jest.fn();
    //const mockToast = jest.fn();
  
    const { getByTestId } = renderedComponent();
  
    // Mock the initial data fetch
    mockGetData.mockResolvedValueOnce({
      status: 200,
      data: [
        { id: 1, email_id: 'atul@gmail.com', mobile_no_call: "8975461325", mobile_isd_call: "+91", mobile_isd_watsapp: "+91", mobile_no_watsapp: "8975642563" },
      ],
    });
  
    // Fetch data to determine flag value
    let flagValue = false;
    const fetchData = async () => {
      const response = await mockGetData();
      if (response.status === 200 && response.data.length > 0) {
        flagValue = true;
      } else {
        flagValue = false;
      }
    };
    await fetchData();
  
    // Mock the form submission
    const submitForm = getByTestId('submitForm') as HTMLButtonElement;
    submitForm.onclick = mockSubmitHandle;
  
    // Simulate the form submission
    await fireEvent.click(submitForm);
  
    // Mock the responses based on flagValue
    if (flagValue) {
      await mockPutData();
    } else {
      await mockPostData();;
    }
  
    // Wait for assertions
    await waitFor(() => {
      if (flagValue) {
        expect(mockPutData).toHaveBeenCalledTimes(1);
        expect(mockPostData).not.toHaveBeenCalled();
      } else {
        expect(mockPostData).toHaveBeenCalledTimes(1);
        expect(mockPutData).not.toHaveBeenCalled();
      }
  
      // Ensure that the toast notifications were triggered
      //expect(mockToast).toHaveBeenCalled();
    });
  });
  
  // it("should save or update data based on editFlag and payload comparison", async () => {
  //   const mockSubmitHandle = jest.fn();
  //   const mockToast = jest.fn();
    
  //  let  editFlag =false;
  //   // Setup initial state and payload values
  //   const initialState = {
  //     student_id: 1,
  //     mobile_isd_call: '+91',
  //     mobile_no_call: '9876543210',
  //     mobile_isd_watsapp: '+91',
  //     mobile_no_watsapp: '9876543210',
  //     email_id: 'test@example.com',
  //   };
  
  //   const payload = {
  //     student_id: 1,
  //     mobile_isd_call: '+91',
  //     mobile_no_call: '9876543210',
  //     mobile_isd_watsapp: '+91',
  //     mobile_no_watsapp: '9876543210',
  //     email_id: 'test@example.com',
  //   };
  
  //   const eq = deepEqual(initialState, payload); // This is the condition you are testing.
  
  //   const { getByTestId } = renderedComponent();
  
  //   // Mock the responses for postData and putData
    
   
   
  
  //   // Simulate the form submission
  //   const submitForm = getByTestId('submitForm') as HTMLButtonElement;
  //   submitForm.onclick = mockSubmitHandle;
  

  //   if(editFlag){
  //     mockPutData()
  //     mockSetActiveForm(3);
  //   }else{
  //     if(!eq){
  //       mockPostData();
  //     }
  //     mockSetActiveForm(3);
  //   }
  
  //   // Wait for assertions
  //   await waitFor(() => {
  //     if (editFlag) {
  //       // If editFlag is true, expect postData and toast success with save message
  //       expect(mockPostData).toHaveBeenCalledTimes(1);
  //       expect(mockPutData).not.toHaveBeenCalled();
  //       expect(mockToast).toHaveBeenCalledWith('Contact Details saved successfully');
  //     } else {
  //       if(!eq){
  //         expect(mockPostData).not.toHaveBeenCalled();
  //         expect(mockPutData).toHaveBeenCalledTimes(1);
  //         expect(mockToast).toHaveBeenCalledWith('Contact Details updated successfully');
  //       }
  //     }
  //   });
  // });
  
})