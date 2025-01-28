import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import useApi from '../../../hooks/useAPI';
import AdminFeedbackView from '..';

jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getData: jest.fn(),
    postData: jest.fn(),
    putData: jest.fn(),
    postFileData: jest.fn(),
  })),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockGetData = jest.fn();
const mockPostData = jest.fn();
const mockPutData = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useApi as jest.Mock).mockImplementation(() => ({
    getData: mockGetData,
    postData: mockPostData,
    putData: mockPutData,
  }));
});

describe('AdminFeedbackView Component', () => {
  const mockFeedbackData = [
    {
      id: 1,
      created_by: 'Admin',
      question: 'How do you rate our service?',
      options: 'Good, Average, Poor',
      created_at: '2023-10-01T10:00:00Z',
      updated_by: 'Admin',
      updated_at: '2023-10-02T12:00:00Z',
      is_active: true,
      is_deleted: false,
    },
  ];

  it('renders feedback data when API call is successful', async () => {
    mockGetData.mockResolvedValueOnce({ status: 200, data: mockFeedbackData });

    render(<AdminFeedbackView />);

    await waitFor(() => {
      expect(
        screen.getByText('How do you rate our service?'),
      ).toBeInTheDocument();
      const adminTexts = screen.getAllByText('Admin');
      expect(adminTexts).toHaveLength(2);
      expect(screen.getByText('Good, Average, Poor')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();
    });

    expect(mockGetData).toHaveBeenCalledWith('/feedback/');
    expect(mockGetData).toHaveBeenCalledTimes(1);
  });

  it('renders only headers when API returns empty data', async () => {
    mockGetData.mockResolvedValueOnce({ status: 200, data: [] });

    render(<AdminFeedbackView />);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(1);
    });

    expect(mockGetData).toHaveBeenCalledWith('/feedback/');
  });

  it('handles API failure gracefully', async () => {
    mockGetData.mockResolvedValueOnce({ status: 500, data: [] });

    render(<AdminFeedbackView />);

    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(1);
    });

    expect(mockGetData).toHaveBeenCalledWith('/feedback/');
  });
});
