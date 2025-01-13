import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddEditRolevsForm from '../AddEditRolevsForm';
import useApi from '../../../hooks/useAPI';
import { contextValue } from '../../../MockStorage/mockstorage';
import NameContext from '../../Context/NameContext';
jest.mock('../../../hooks/useAPI');

describe('AddEditRolevsForm Component', () => {
  const mockGetData = jest.fn();
  const mockPostData = jest.fn();
  const mockPutData = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
    useParams: jest.fn(),
  }));
  jest.mock('../../../hooks/useAPI', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
      postData: jest.fn().mockResolvedValueOnce({
        status: 200,
        message: 'Role vs Form added successfully',
      }),
      getData: jest.fn(),
      putData: jest.fn(),
    }),
  }));
  beforeEach(() => {
    jest.clearAllMocks();
    (useApi as jest.Mock).mockReturnValue({
      getData: mockGetData,
      postData: mockPostData,
      putData: mockPutData,
    });

    mockGetData.mockResolvedValue({
      data: {
        created_at: 'Thu, 19 Dec 2024 06:45:11 GMT',
        form_master_id: 95,
        id: 358,
        is_active: 1,
        is_deleted: false,
        is_save: true,
        is_search: true,
        is_update: true,
        role_master_id: 26,
        updated_at: 'Tue, 07 Jan 2025 09:30:02 GMT',
      },
    });
  });

  const renderComponent = () =>
    render(
      <NameContext.Provider value={contextValue}>
        <BrowserRouter>
          <AddEditRolevsForm />
        </BrowserRouter>
      </NameContext.Provider>,
    );

  it('renders the form with initial values', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('role_master_id')).toBeInTheDocument();
    expect(getByTestId('form_master_id')).toBeInTheDocument();
    expect(getByTestId('submitBtn')).toBeInTheDocument();
  });

  it('fetches data on component load', async () => {
    mockGetData.mockResolvedValueOnce({
      data: [{ id: 1, role_name: 'Admin', is_active: 1 }],
    });
    mockGetData.mockResolvedValueOnce({
      data: [{ id: 2, form_name: 'Form1', is_active: 1 }],
    });

    renderComponent();

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledTimes(2);
      expect(mockGetData).toHaveBeenCalledWith(
        expect.stringContaining('/role/list'),
      );
      expect(mockGetData).toHaveBeenCalledWith(
        expect.stringContaining('/form/list'),
      );
    });
  });

  it('validates form inputs', async () => {
    const { getByTestId } = renderComponent();
    const savebtn = getByTestId('submitBtn');
    fireEvent.click(savebtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Please select Role master/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Please select Form master/i),
      ).toBeInTheDocument();
    });
  });

  // it('submits form data via POST for adding a new entry', async () => {
  //    (useParams as jest.Mock).mockReturnValue({ id: '1' });
  //   mockPostData.mockResolvedValueOnce({ status: 200, message: 'Role vs Form added successfully' });

  //   const { getByTestId } = renderComponent();

  //   const role_master_id = getByTestId('role_master_id').querySelector(
  //     'input',
  //   ) as HTMLElement;
  //   const form_master_id = getByTestId('form_master_id').querySelector(
  //     'input',
  //   ) as HTMLElement;
  //   const is_search = getByTestId('is_search') as HTMLElement;
  //   const is_save = getByTestId('is_save') as HTMLElement;
  //   const is_update = getByTestId('is_update') as HTMLElement;
  //   fireEvent.change(role_master_id, { target: { value: '1' } });
  //   fireEvent.change(form_master_id, { target: { value: '2' } });
  //   fireEvent.click(is_search, { selector: 'input[value="true"]' });
  //   fireEvent.click(is_save, { selector: 'input[value="true"]' });
  //   fireEvent.click(is_update, { selector: 'input[value="true"]' });
  //   const savebtn = getByTestId('submitBtn')
  //   fireEvent.click(savebtn);

  //    await waitFor(() => {
  //         expect(toast.success).toHaveBeenCalledWith(
  //           'Role vs Form added successfully',
  //           expect.any(Object),
  //         );
  //       });
  // });
  // it('submits form data via PUT for editing an existing entry', async () => {

  //   // eslint-disable-next-line @typescript-eslint/no-require-imports
  //   require('react-router-dom').useParams.mockReturnValue({ id: '123' });

  //   mockPutData.mockResolvedValueOnce({ status: 200, message: 'Role vs Form updated successfully' });

  //   const { getByTestId } = renderComponent();
  //   const savebtn = getByTestId('submitBtn')
  //   fireEvent.click(savebtn);
  //   // fireEvent.click(screen.getByText(/Update/i));

  //   // await waitFor(() => {
  //   //   expect(mockPutData).toHaveBeenCalledWith(expect.stringContaining('/main/RoleVsForm'), expect.any(Object));
  //   //   // eslint-disable-next-line @typescript-eslint/no-require-imports
  //   //   expect(require('react-router-dom').useNavigate).toHaveBeenCalledWith('/main/RoleVsForm');
  //   // });
  //   await waitFor(() => {
  //             expect(toast.success).toHaveBeenCalledWith(
  //               'Role vs Form updated successfully');
  //           });
  //   expect(screen.getByText(/Role vs Form updated successfully/i)).toBeInTheDocument();
  // });
});
