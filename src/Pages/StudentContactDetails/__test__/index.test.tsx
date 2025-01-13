import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { contextValue } from '../../../MockStorage/mockstorage';
import NameContext from '../../Context/NameContext';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import StudentcontactDetails from '..';
import useApi from '../../../hooks/useAPI';
import { toast } from 'react-toastify';
//import { deepEqual } from '../../../utils/helpers';
jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getData: jest.fn(),
    postData: jest.fn(),
    putData: jest.fn(),
  })),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
describe('Student Contect Component', () => {
  // Mocking the required props
  const mockSetActiveForm = jest.fn();
  const mockActiveForm = 2;
  const mockGetData = jest.fn();
  const mockPostData = jest.fn();
  const mockPutData = jest.fn();

  beforeEach(() => {
    mockPostData.mockReset();
    mockPutData.mockReset();
    (useApi as jest.Mock).mockImplementation(() => ({
      getData: mockGetData.mockResolvedValue({ getData: mockGetData }), // Mock resolved promise
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

  it('Should render Student contect component correctly', () => {
    const { asFragment } = renderedComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render fields Student contact correctly', () => {
    const { getByTestId, getByText, getByRole } = renderedComponent();
    const prevButten = getByRole('button', {
      name: /previous/i,
    });
    const nextbutten = getByRole('button', {
      name: /next/i,
    });
    expect(getByTestId('county_pcode')).toBeInTheDocument();
    expect(getByTestId('county_wpcode')).toBeInTheDocument();
    expect(getByTestId('mobile_num')).toBeInTheDocument();
    expect(getByTestId('email_id')).toBeInTheDocument();
    expect(getByTestId('whtmobile_num')).toBeInTheDocument();
    expect(getByText(/mobile number \*/i)).toBeInTheDocument();
    expect(getByText(/whatsapp number/i)).toBeInTheDocument();
    expect(getByText(/email id/i)).toBeInTheDocument();
    expect(nextbutten).toBeInTheDocument();
    expect(prevButten).toBeInTheDocument();
  });

  it('should call handleChange function on input change', async () => {
    const { getByTestId } = renderedComponent();

    const mobileInput = getByTestId('mobile_num').querySelector(
      'input',
    ) as HTMLInputElement;
    const whatsappNum = getByTestId('whtmobile_num').querySelector(
      'input',
    ) as HTMLInputElement;
    const emailInput = getByTestId('email_id').querySelector(
      'input',
    ) as HTMLInputElement;
    const countrycodeDropdown = getByTestId('county_pcode').querySelector(
      'input',
    ) as HTMLInputElement;
    const countrycodewhatsaDropdown = getByTestId(
      'county_wpcode',
    ).querySelector('input') as HTMLInputElement;

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

  it('should call setActiveForm function when previous is clicked', async () => {
    const { getByTestId } = renderedComponent();

    const button = getByTestId('gobackform');
    fireEvent.click(button);

    expect(mockSetActiveForm).toHaveBeenCalledTimes(1);

    expect(mockSetActiveForm).toHaveBeenCalledWith(expect.any(Function));

    const decrementFunction = mockSetActiveForm.mock.calls[0][0];
    expect(decrementFunction(5)).toBe(4);
  });

  it('should display validation message when mobile number is invalid', () => {
    const { getByTestId } = renderedComponent();

    const mobileInput = getByTestId('mobile_num').querySelector(
      'input',
    ) as HTMLInputElement;

    fireEvent.change(mobileInput, { target: { value: 'sjbvks' } });
    fireEvent.blur(mobileInput);

    expect(
      screen.getByText((content) =>
        content.includes('Mobile number should be 10 digits'),
      ),
    ).toBeInTheDocument();

    fireEvent.change(mobileInput, { target: { value: '123456789' } });
    fireEvent.blur(mobileInput);
    expect(
      screen.getByText((content) =>
        content.includes('Mobile number should be 10 digits'),
      ),
    ).toBeInTheDocument();

    fireEvent.change(mobileInput, { target: { value: '123456789012' } });
    fireEvent.blur(mobileInput);
    expect(
      screen.getByText((content) =>
        content.includes('Mobile number should be 10 digits'),
      ),
    ).toBeInTheDocument();

    fireEvent.change(mobileInput, { target: { value: '1234567890' } });
    fireEvent.blur(mobileInput);

    expect(
      screen.queryByText((content) =>
        content.includes('Mobile number should be 10 digits'),
      ),
    ).not.toBeInTheDocument();
  });

  it('should be check GET data of user details ', async () => {
    const mockSubmitHandle = jest.fn();

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === '_id') {
        return '76'; // Mock the studentId value
      }
      return null;
    });
    mockGetData.mockResolvedValue({
      status: 200,
      data: [
        {
          _id: 1,
          email_id: 'atul@gmail.com',
          mobile_no_call: '8975461325',
          mobile_isd_call: '+91',
          mobile_isd_watsapp: '+91',
          mobile_no_watsapp: '8975642563',
        },
      ],
    });
    (useApi as jest.Mock).mockReturnValue({ getData: mockGetData });

    const { getByTestId } = renderedComponent();

    const submitForm = getByTestId('submitForm') as HTMLButtonElement;

    submitForm.onclick = mockSubmitHandle;
    fireEvent.click(submitForm);

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledWith('student_contact/edit/76');
    });
  });

  it('should check update API called', async () => {
    mockPutData.mockResolvedValue({
      status: 200,
      message: 'Contact Details updated successfully',
    });

    const mockSubmitHandle = jest.fn();

    const { getByTestId } = renderedComponent();

    const submitForm = getByTestId('submitForm') as HTMLButtonElement;
    const mobileInput = getByTestId('mobile_num').querySelector(
      'input',
    ) as HTMLInputElement;
    const whatsappNum = getByTestId('whtmobile_num').querySelector(
      'input',
    ) as HTMLInputElement;
    const emailInput = getByTestId('email_id').querySelector(
      'input',
    ) as HTMLInputElement;
    const countrycodeDropdown = getByTestId('county_pcode').querySelector(
      'input',
    ) as HTMLInputElement;
    const countrycodewhatsaDropdown = getByTestId(
      'county_wpcode',
    ).querySelector('input') as HTMLInputElement;

    fireEvent.change(mobileInput, { target: { value: '9876545678' } });
    fireEvent.change(whatsappNum, { target: { value: '6765433458' } });
    fireEvent.change(emailInput, { target: { value: 'atul@gmail.com' } });
    fireEvent.change(countrycodeDropdown, { target: { value: '+91' } });
    fireEvent.change(countrycodewhatsaDropdown, { target: { value: '+91' } });

    submitForm.onclick = mockSubmitHandle;
    fireEvent.click(submitForm);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Contact Details updated successfully',
        expect.any(Object),
      );
    });

    expect(mockSubmitHandle).toHaveBeenCalled();

    expect(mockPostData).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
    );

    expect(mockPutData).toHaveBeenCalled();
  });
});
