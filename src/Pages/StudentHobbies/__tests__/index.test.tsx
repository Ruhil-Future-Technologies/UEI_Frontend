import React from 'react';
import StudentHobbies from '..';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NameContext from '../../Context/NameContext';
import { BrowserRouter } from 'react-router-dom';
import { contextValue } from '../../../MockStorage/mockstorage';
import useApi from '../../../hooks/useAPI';

jest.mock('../../../hooks/useAPI');
describe('Student Hobbies Component', () => {
  const mockGetData = jest.fn();
  const mockPostData = jest.fn();
  const mockPutData = jest.fn();
  const mockDeleteData = jest.fn();

  const mockSetSave = jest.fn();
  const mockSetIsHobbiesUpdated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => '12345'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    (useApi as jest.Mock).mockReturnValue({
      getData: mockGetData,
      postData: mockPostData,
      putData: mockPutData,
      deleteData: mockDeleteData,
    });

    mockGetData.mockImplementation((endpoint) => {
      if (endpoint === 'hobby/list') {
        return Promise.resolve({
          status: true,
          data: {
            hobby_data: [
              { id: '1', hobby_name: 'Reading', is_active: true },
              { id: '2', hobby_name: 'Gaming', is_active: true },
            ],
          },
        });
      } else if (endpoint === 'student_hobby/get/12345') {
        return Promise.resolve({
          code: 200,
          data: [],
        });
      }
      return Promise.resolve({ status: false });
    });
  });

  it('should render the student hobbies component', async () => {
    render(
      <NameContext.Provider value={contextValue}>
        <BrowserRouter>
          <StudentHobbies
            save={false}
            setSave={mockSetSave}
            setIsHobbiesUpdated={mockSetIsHobbiesUpdated}
            isLanguageUpdated={false}
          />
        </BrowserRouter>
      </NameContext.Provider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('hobby_text')).toBeInTheDocument();
    });
  });

  it('should fetch and display hobbies', async () => {
    render(
      <NameContext.Provider value={contextValue}>
        <BrowserRouter>
          <StudentHobbies
            save={false}
            setSave={mockSetSave}
            setIsHobbiesUpdated={mockSetIsHobbiesUpdated}
            isLanguageUpdated={false}
          />
        </BrowserRouter>
      </NameContext.Provider>,
    );

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledWith('hobby/list');
      expect(mockGetData).toHaveBeenCalledWith('student_hobby/get/12345');
    });

    const selectElement = await screen.findByLabelText('Hobby');
    fireEvent.mouseDown(selectElement);

    await waitFor(() => {
      expect(screen.getByText('Reading')).toBeInTheDocument();
      expect(screen.getByText('Gaming')).toBeInTheDocument();
    });
  });

  it('should select a hobby when checkbox is clicked', async () => {
    render(
      <NameContext.Provider value={contextValue}>
        <BrowserRouter>
          <StudentHobbies
            save={false}
            setSave={mockSetSave}
            setIsHobbiesUpdated={mockSetIsHobbiesUpdated}
            isLanguageUpdated={false}
          />
        </BrowserRouter>
      </NameContext.Provider>,
    );

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalledWith('hobby/list');
    });

    const selectElement = await screen.findByLabelText('Hobby');
    fireEvent.mouseDown(selectElement);

    const checkboxes = await screen.findAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);

    fireEvent.click(checkboxes[0]);

    // Verify that setIsHobbiesUpdated was called
    expect(mockSetIsHobbiesUpdated).toHaveBeenCalledWith(true);
  });
});
