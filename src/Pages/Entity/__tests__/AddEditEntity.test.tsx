import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddEditEntity from '../AddEditEntity'; // Adjust the import path as necessary
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import useApi from '../../../hooks/useAPI';
// import { QUERY_KEYS_ENTITY } from '../../../utils/const';
import React from 'react';
import NameContext from '../../Context/NameContext'; // Adjust the import path as necessary
import { contextValue } from '../../../MockStorage/mockstorage';
import { QUERY_KEYS_ENTITY } from '../../../utils/const';

// Mock the external dependencies
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockNavigate = jest.fn();
const mockLocation = {
  pathname: '/main/Entity',
  search: '',
  hash: '',
  state: null,
};
const mockPostData = jest.fn();
const mockPutData = jest.fn();
const mockGetData = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe('AddEditEntity Component', () => {
  beforeEach(() => {
    mockPostData.mockReset();
    mockPutData.mockReset();
    mockGetData.mockReset();

    // Mock the `useApi` hook to return these methods
    (useApi as jest.Mock).mockReturnValue({
      getData: mockGetData,
      postData: mockPostData,
      putData: mockPutData,
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
  });

  it('renders the form with the entity_type field', () => {
    const { getByTestId } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditEntity />
        </Router>
      </NameContext.Provider>,
    );
    const entityField = getByTestId('entity_type');
    // const entityField = screen.getByLabelText(/Entity Type \*/i);
    expect(entityField).toBeInTheDocument();
  });

  it('validates entity_type input correctly', async () => {
    const { getByLabelText, getByText } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditEntity />
        </Router>
      </NameContext.Provider>,
    );

    const entityField = getByLabelText(/Entity Type \*/i);
    // const entityField = getByTestId("entity_type");
    fireEvent.change(entityField, { target: { value: '   ' } }); // Invalid input (whitespace)
    fireEvent.blur(entityField);

    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      expect(
        getByText((content, _element) => {
          return /Please enter a valid Entity type; whitespace is not allowed./i.test(
            content,
          );
        }),
      ).toBeInTheDocument();
    });
  });

  it('submits form with valid data when creating a new entity', async () => {
    const mockSuccessResponse = {
      status: 200,
      message: 'Entity created successfully',
    };

    mockPostData.mockResolvedValue(mockSuccessResponse);

    const { getByLabelText, getByRole } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditEntity />
        </Router>
      </NameContext.Provider>,
    );

    // Fill out the form fields
    fireEvent.change(getByLabelText(/Entity Type \*/i), {
      target: { value: 'New Entity' },
    });

    // Submit the form by clicking the "Save" button
    const submitButton = getByRole('button', { name: /Save/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Entity created successfully',
        expect.any(Object),
      );
    });

    // Verify the API was called with the correct payload
    await waitFor(() => {
      expect(useApi().postData).toHaveBeenCalledWith(
        QUERY_KEYS_ENTITY.ENTITY_ADD,
        { entity_type: 'New Entity' },
      );
    });
  });

  //   it('submits form with valid data when editing an entity', async () => {
  //     const mockSuccessResponse = {
  //       status: 200,
  //       message: 'Entity updated successfully',
  //     };
  //     mockPutData.mockResolvedValue(mockSuccessResponse);

  //     const { getByLabelText, getByRole } = render(
  //         <NameContext.Provider value={contextValue}>
  //             <Router>
  //             <AddEditEntity />
  //             </Router>
  //         </NameContext.Provider>
  //     );

  //     // Fill out the form fields
  //     fireEvent.change(getByLabelText(/Entity Type \*/i), {
  //       target: { value: 'Updated Entity' },
  //     });

  //     // Submit the form by clicking the "Update" button
  //     const submitButton = getByRole('button', { name: /Save/i });
  //     fireEvent.click(submitButton);

  //     await waitFor(() => {
  //       expect(toast.success).toHaveBeenCalledWith(
  //         'Entity updated successfully',
  //         expect.any(Object)
  //       );
  //     });

  //     // Verify the API was called with the correct payload
  //     await waitFor(() => {
  //       expect(useApi().putData).toHaveBeenCalledWith(
  //         `${QUERY_KEYS_ENTITY.ENTITY_EDIT}/1`,
  //         { entity_type: 'Updated Entity' }
  //       );
  //     });
  //   });

  it('displays error message when API call fails (POST)', async () => {
    const mockErrorResponse = {
      status: 500,
      message: 'Failed to create entity',
    };

    mockPostData.mockRejectedValue(mockErrorResponse);

    const { getByLabelText, getByRole } = render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <AddEditEntity />
        </Router>
      </NameContext.Provider>,
    );

    // Fill out the form fields
    fireEvent.change(getByLabelText(/Entity Type \*/i), {
      target: { value: 'New Entity' },
    });

    const submitButton = getByRole('button', { name: /Save/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Failed to create entity',
        expect.any(Object),
      );
    });
  });

  //   it('displays error message when API call fails (PUT)', async () => {
  //     const mockErrorResponse = {
  //       status: 500,
  //       message: 'Failed to update entity',
  //     };

  //     mockPutData.mockRejectedValue(mockErrorResponse);

  //     render(
  //       <Router>
  //         <AddEditEntity />
  //       </Router>
  //     );

  //     // Fill out the form fields
  //     fireEvent.change(screen.getByLabelText(/Entity Type \*/i), {
  //       target: { value: 'Updated Entity' },
  //     });

  //     const submitButton = screen.getByRole('button', { name: /Update/i });
  //     fireEvent.click(submitButton);

  //     await waitFor(() => {
  //       expect(toast.error).toHaveBeenCalledWith(
  //         'Failed to update entity',
  //         expect.any(Object)
  //       );
  //     });
  //   });
});
