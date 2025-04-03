import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { contextValue } from '../../../MockStorage/mockstorage';
import NameContext from '../../Context/NameContext';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import AdminContactDetails from '..';

describe('Admin Contect Component', () => {
  // Mocking the required props
  const mockSetActiveForm = jest.fn();
  const mockActiveForm = 2;

  const renderedComponent = () => {
    return render(
      <NameContext.Provider value={contextValue}>
        <MemoryRouter>
          <AdminContactDetails
            setActiveForm={mockSetActiveForm}
            activeForm={mockActiveForm}
          />
        </MemoryRouter>
      </NameContext.Provider>,
    );
  };

  it('Should render Aadmin contect component correctly', () => {
    const { asFragment } = renderedComponent();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render fields Admin contact correctly', () => {
    const { getByTestId, getByText, getByRole } = renderedComponent();
    const prevButten = getByRole('button', {
      name: /previous/i,
    });
    const nextbutten = getByRole('button', {
      name: /Submit/i,
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
});
