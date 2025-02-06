import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Submenu from '../Submenu';
import useApi from '../../../hooks/useAPI';
import { BrowserRouter as Router } from 'react-router-dom';
import NameContext from '../../Context/NameContext';
import { contextValue } from '../../../MockStorage/mockstorage';
import { DeleteDialog } from '../../../Components/Dailog/DeleteDialog';

jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    getData: jest.fn(),
    deleteData: jest.fn(),
    loading: false,
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockGetData = jest.fn();
const mockOnCancel = jest.fn();
const mockOnDeleteClick = jest.fn();
const mockDeleteData = jest.fn();
(useApi as jest.Mock).mockReturnValue({
  getData: mockGetData,
  deleteData: mockDeleteData,
  loading: false,
});

describe('Submenu Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnCancel.mockClear();
    mockOnDeleteClick.mockClear();
    (useApi as jest.Mock).mockReturnValue({
      pathname: 'localhost:3000/main/main/submenu',
      getData: jest.fn().mockResolvedValue({
        data: [
          { id: 1, menu_name: 'Submenu 1' },
          { id: 2, menu_name: 'Submenu 2' },
        ],
      }),
      deleteData: jest.fn(),
      loading: false,
    });

    localStorage.setItem('menulist1', JSON.stringify([]));
  });

  it('renders Submenu component', async () => {
    render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <Submenu />
        </Router>
      </NameContext.Provider>,
    );
    expect(screen.getByText('Submenu')).toBeInTheDocument();
  });
  it('should render the dialog when open', () => {
    render(
      <DeleteDialog
        isOpen={true}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Delete documents?"
      />,
    );

    // Assert that the dialog is rendered
    expect(screen.getByText('Delete documents?')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to delete this file? This action cannot be undone.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
  it('should call onCancel when Cancel button is clicked', () => {
    render(
      <DeleteDialog
        isOpen={true}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Delete documents?"
      />,
    );

    // Simulate a click on the Cancel button
    fireEvent.click(screen.getByText('Cancel'));

    // Assert that onCancel was called
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
  it('should trigger the Delete button action', () => {
    render(
      <DeleteDialog
        isOpen={true}
        onCancel={mockOnCancel}
        onDeleteClick={mockOnDeleteClick}
        title="Delete documents?"
      />,
    );

    // Simulate clicking the Ok button
    fireEvent.click(screen.getByText('Delete'));

    // Assert that onDeleteClick was called once
    expect(mockOnDeleteClick).toHaveBeenCalledTimes(1);
  });
});
