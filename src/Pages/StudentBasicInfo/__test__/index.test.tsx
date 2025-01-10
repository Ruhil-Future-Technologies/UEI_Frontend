import React from "react";
import StudentBasicInfo from "..";
import NameContext from "../../Context/NameContext";
import { contextValue } from "../../../MockStorage/mockstorage";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, } from "@testing-library/react";
import dayjs from 'dayjs';
import useApi from "../../../hooks/useAPI";
//import { toast } from 'react-toastify';



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
describe("student basic infrmation page",()=>{
    const mockSetActiveForm = jest.fn();
    const mockActiveForm = 3;

    const mockGetData = jest.fn();
    const mockPostData = jest.fn();
    const mockPutData = jest.fn();
    const mokePostFileData=jest.fn();
    beforeEach(() => {
      mockPostData.mockReset();
      mockPutData.mockReset();
      (useApi as jest.Mock).mockImplementation(() => ({
        getData: mockGetData.mockResolvedValue({ getData: mockGetData }), // Mock resolved promise
        postData: mockPostData,
        putData: mockPutData, 
        postFileData: mokePostFileData
      }));
    });
    const renderedComponent = () => {
        return render(
          <NameContext.Provider value={contextValue}>
            <MemoryRouter>
              <StudentBasicInfo
                setActiveForm={mockSetActiveForm}
                activeForm={mockActiveForm}
              />
            </MemoryRouter>
          </NameContext.Provider>,
        );
      };
    it("Should render the student basic info page currectly",()=>{
        const {asFragment}=renderedComponent();
        expect(asFragment()).toMatchSnapshot();
    })

    it("should render fields Student basicinfo correctly ",()=>{
        const { getByTestId, getByLabelText } = renderedComponent();
    const datePicker = getByLabelText('datepicker_label') as HTMLInputElement;

    expect(getByTestId('first_name')).toBeInTheDocument();
    expect(getByTestId('last_name')).toBeInTheDocument();
    expect(getByTestId('gender')).toBeInTheDocument();
    expect(datePicker).toBeInTheDocument();
    expect(getByTestId('father_name')).toBeInTheDocument();
    expect(getByTestId("aim")).toBeInTheDocument();
    expect(getByTestId('mother_name')).toBeInTheDocument();
    expect(getByTestId('guardian_name')).toBeInTheDocument();
    expect(getByTestId('profile_image')).toBeInTheDocument();
    expect(getByTestId('next_button')).toBeInTheDocument();
    })


    it("shuld handleChange fuction on change any fields ",()=>{
        const { getByTestId } = renderedComponent();

        
        const firstNameInput = getByTestId('first_name') as HTMLInputElement;
        const lastNameInput = getByTestId('last_name') as HTMLInputElement;
    
        
        const gender = getByTestId('gender').querySelector(
          'input[value="male"]',
        ) as HTMLInputElement; 
    
        const father_name = getByTestId('father_name') as HTMLInputElement;
        const mother_name = getByTestId('mother_name') as HTMLInputElement;
        const guardian_name = getByTestId('guardian_name') as HTMLInputElement;
        const Aim=getByTestId("aim") as HTMLInputElement;
        
        fireEvent.change(firstNameInput, { target: { value: 'John' } });
        fireEvent.change(lastNameInput, { target: { value: 'Patel' } });
        fireEvent.change(Aim,{target:{value:"testing"}});
        
        if (gender) {
          fireEvent.click(gender);
        }
    
        fireEvent.change(father_name, { target: { value: 'father' } });
        fireEvent.change(mother_name, { target: { value: 'mother' } });
        fireEvent.change(guardian_name, { target: { value: 'guardian' } });
    
 
        expect(firstNameInput.value).toBe('John');
        expect(lastNameInput.value).toBe('Patel');
    
        
        if (gender) {
          expect(gender.checked).toBe(true); 
        }
        expect(Aim.value).toBe("testing");
        expect(father_name.value).toBe('father');
        expect(mother_name.value).toBe('mother');
        expect(guardian_name.value).toBe('guardian');
    })
     it('should call handleDateChange when DatePicker value changes', async () => {
        const { getByLabelText } = renderedComponent();
    
        const datePicker = getByLabelText('datepicker_label') as HTMLInputElement;
        const zeroPad = (num: number) => String(num).padStart(2, '0');
        const dayString = zeroPad(1);
        const monthString = zeroPad(1);
        const yearString = String(2001);
        const dateText = `${monthString}/${dayString}/${yearString}`;
        fireEvent.change(datePicker, { target: { value: dateText } });
        const datePickerValue = `${monthString}/${dayString}/${yearString}`;
        expect(datePicker.value).toBe(datePickerValue);
      });
    
      it('should call handleDateChange and give errors when DatePicker value changes for future dates or invalid dates', async () => {
        const { getByLabelText, getByText } = renderedComponent();
    
        
        const datePicker = getByLabelText('datepicker_label');
    
       
        const futureDate = dayjs().add(1, 'year').format('DD/MM/YYYY');
        fireEvent.change(datePicker, { target: { value: futureDate } });
    
     
        expect(getByText('Future dates are not allowed.')).toBeInTheDocument();
    
        const youngerThanSixDate = dayjs()
          .subtract(5, 'years')
          .format('DD/MM/YYYY');
        fireEvent.change(datePicker, { target: { value: youngerThanSixDate } });
    
      
        expect(getByText('You must be at least 6 years old.')).toBeInTheDocument();
      });
    
      it('should update file preview when a valid image is selected', async () => {
        // Render the component
        mokePostFileData.mockResolvedValue({
          status: 200,
          message: 'Basic information updated successfully',
        });
        const { getByTestId, findByAltText } = renderedComponent();
    
        const fileInput = getByTestId('profile_image') as HTMLInputElement;
    
        const file = new File(['image content'], 'valid-image.png', {
          type: 'image/png',
        });
    
        const fileReaderMock = {
          onloadend: jest.fn(),
          readAsDataURL: jest.fn(),
          result: 'data:image/png;base64,exampledata',
          EMPTY: 0,
          LOADING: 1,
          DONE: 2,
        };
    
        Object.defineProperty(global, 'FileReader', {
          writable: true,
          value: jest.fn().mockImplementation(() => fileReaderMock),
        });
    
        fireEvent.change(fileInput, {
          target: { files: [file] },
        });
    
        expect(fileReaderMock.readAsDataURL).toHaveBeenCalledWith(file);
    
        fileReaderMock.onloadend();
    
        const filePreviewImage = (await findByAltText(
          'Uploaded Preview',
        )) as HTMLInputElement;
    
        expect(filePreviewImage.src).toBe(fileReaderMock.result);
      });

    //  it("should call submitHandel function when we click on the next button",async ()=>{

    //   mockPutData.mockResolvedValue({
    //      status: 200,
    //      message: 'Basic information updated successfully',
    //    });
    
    //   const submitHandel=jest.fn();
    //    const { getByTestId } = renderedComponent();
    //    const firstNameInput = getByTestId('first_name') as HTMLInputElement;
    //    const lastNameInput = getByTestId('last_name') as HTMLInputElement;
   
       
    //    const gender = getByTestId('gender').querySelector(
    //      'input[value="male"]',
    //    ) as HTMLInputElement; 
   
    //    const father_name = getByTestId('father_name') as HTMLInputElement;
    //    const mother_name = getByTestId('mother_name') as HTMLInputElement;
    //    const guardian_name = getByTestId('guardian_name') as HTMLInputElement;
   
       
    //    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    //    fireEvent.change(lastNameInput, { target: { value: 'Patel' } });
   
       
    //    if (gender) {
    //      fireEvent.click(gender);
    //    }
   
    //    fireEvent.change(father_name, { target: { value: 'father' } });
    //    fireEvent.change(mother_name, { target: { value: 'mother' } });
    //    fireEvent.change(guardian_name, { target: { value: 'guardian' } });
   
    //    const nextButton = getByTestId('next_button');
    //    nextButton.onclick=submitHandel;
    //    fireEvent.click(nextButton);
    //    await waitFor(() => {
    //          expect(toast.success).toHaveBeenCalledWith(
    //            'Basic information updated successfully', 
    //            expect.any(Object)
    //          );
    //        });
         
         
    //        expect(submitHandel).toHaveBeenCalled();
         
    //        expect(mockPostData).not.toHaveBeenCalledWith(
    //          expect.anything(),
    //          expect.anything()  
    //        );
         
           
    //        expect(mockPutData).toHaveBeenCalled();
    //      });
    
    
})