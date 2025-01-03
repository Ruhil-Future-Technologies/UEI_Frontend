import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import University from '../University'; // The component to be tested

import { BrowserRouter as Router } from 'react-router-dom';
import NameContext from '../../Context/NameContext';
import { contextValue } from '../../../MockStorage/mockstorage';
import useApi from '../../../hooks/useAPI';
import { toast } from 'react-toastify';

// Mocking dependencies
jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep the real implementations for other hooks
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
}));

describe('AddUniversity Component', () => {
  const mockPostData = jest.fn();
  const mockGetData = jest.fn();
  const mockPutData = jest.fn();
  // const mockNavigate = jest.fn();
  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue({
      postData: mockPostData,
      getData: mockGetData,
      putData: mockPutData,
    });

    mockPostData.mockClear();
    mockGetData.mockClear();
    mockPutData.mockClear();
  });

  test('renders the university table and add university button', async () => {
    // Mocking the API call responses
    mockPostData.mockResolvedValue({
      status: 201,
      message: 'University added successfully!',
    });
    mockGetData.mockResolvedValueOnce({
      data: [{ university_id: 1, name: 'University 1' }],
    });

    render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <University />
        </Router>
      </NameContext.Provider>,
    );
    expect(screen.getByText('University')).toBeInTheDocument();
    expect(screen.getByText('Add University')).toBeInTheDocument();
  });

  test('handles API failure and shows error toast', async () => {
    // Mock the API call to fail
    mockGetData.mockRejectedValueOnce({
      message: 'Failed to fetch universities',
    });

    render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <University />
        </Router>
      </NameContext.Provider>,
    );

    // Wait for the API call to complete and check for the toast error message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch universities', {
        hideProgressBar: true,
        theme: 'colored',
      });
    });
  });
  // test('navigates to the edit university page when edit button is clicked', () => {

  //   // Mock the API response
  //   mockGetData.mockResolvedValueOnce({ data: [{ university_id: 1, name: 'University 1' }] });

  //   const {  getByTestId }= render(
  //     <NameContext.Provider value={contextValue}>
  //     <Router>
  //       <University />
  //     </Router>
  //   </NameContext.Provider>
  //   );

  //    fireEvent.click(getByTestId('edit_btn'));
  //   // Check if navigate was called with the correct URL
  //   expect(mockNavigate).toHaveBeenCalledWith('edit-University/1');
  // });

  // test('shows loading spinner while loading', () => {

  //   render(
  //     <NameContext.Provider value={contextValue}>
  //    <Router>
  //       <University />
  //      </Router>
  //    </NameContext.Provider>
  //   );

  //   // Check if the loader is visible
  //   expect(screen.getByTestId('full-screen-loader')).toBeInTheDocument();
  // });
});
