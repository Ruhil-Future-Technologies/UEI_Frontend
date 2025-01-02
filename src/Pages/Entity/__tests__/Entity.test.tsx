import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // To mock React Router context
import Entity from '../Entity';
import useApi from '../../../hooks/useAPI';
import { toast } from 'react-toastify';
import React from 'react';
import NameContext from '../../Context/NameContext';
import { contextValue } from '../../../MockStorage/mockstorage';

// Mock external dependencies
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.setTimeout(30000);
jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the data returned by the API
const mockEntityData = [
  { id: 1, name: 'Entity 1' },
  { id: 2, name: 'Entity 2' },
];

describe('Entity Component', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  it('should render successfully and load data', async () => {
    // Mock the API calls
    (useApi as jest.Mock).mockReturnValue({
      getData: jest.fn().mockResolvedValue({ data: mockEntityData }), // Mock successful data fetch
      deleteData: jest.fn(),
      loading: false,
    });

    const { getByTestId } = render(
      <NameContext.Provider value={contextValue}>
        <MemoryRouter>
          <Entity />
        </MemoryRouter>
      </NameContext.Provider>,
    );

    // Check if the page is rendering the expected title and button
    const entityField = getByTestId('Entity');
    expect(entityField).toBeInTheDocument();

    // Ensure the API was called to fetch the data
    expect(useApi().getData).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors gracefully', async () => {
    // Mock the API call to simulate an error
    (useApi as jest.Mock).mockReturnValue({
      getData: jest.fn().mockRejectedValue(new Error('API Error')),
      deleteData: jest.fn(),
      loading: false,
    });

    render(
      <NameContext.Provider value={contextValue}>
        <MemoryRouter>
          <Entity />
        </MemoryRouter>
      </NameContext.Provider>,
    );

    // Check if the error toast was triggered
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('API Error', expect.any(Object)),
    );
  });
});
