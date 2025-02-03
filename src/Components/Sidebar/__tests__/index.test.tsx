import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from '..';
import useApi from '../../../hooks/useAPI';
// Mock the required dependencies
jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(),
}));
(useApi as jest.Mock).mockReturnValue({
  getData: jest.fn().mockResolvedValue({ status: 404, data: [] }),
  postData: jest.fn(),
});

jest.mock('../../../assets/img/logo-white.svg', () => 'mockLogo');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    // Mock localStorage and sessionStorage
    Storage.prototype.getItem = jest.fn((key) => {
      switch (key) {
        case 'user_type':
          return 'student';
        case 'Profile_completion':
          return '100';
        default:
          return null;
      }
    });
    Storage.prototype.setItem = jest.fn();
    sessionStorage.getItem = jest.fn((key) =>
      key === 'profileData' ? JSON.stringify({ basic_info: { id: 1 } }) : null,
    );
  });

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { default: useApi } = require('../../../hooks/useAPI');

    // Mock the successful case
    useApi.mockReturnValue({
      getData: jest.fn().mockResolvedValue({
        status: 200,
        data: [],
      }),
      postData: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sidebar with default elements', () => {
    render(
      <Router>
        <Sidebar />
      </Router>,
    );

    expect(screen.getByAltText('')).toBeInTheDocument(); // Logo
    expect(screen.getByText('Gyansetu')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  //   it('calls the API for menu list on mount', async () => {
  //     mockGetData.mockResolvedValueOnce({
  //       data: [{ id: 1, menu_name: 'Test Menu', submenus: [] }],
  //     });

  //     render(
  //       <Router>
  //         <Sidebar />
  //       </Router>,
  //     );

  //     await waitFor(() => {
  //       expect(mockGetData).toHaveBeenCalledWith(
  //         `${QUERY_KEYS_MENU.GET_MENU}/student`,
  //       );
  //     });
  //     expect(localStorage.setItem).toHaveBeenCalledWith(
  //       'menulist',
  //       JSON.stringify([{ id: 1, menu_name: 'Test Menu', submenus: [] }]),
  //     );
  //   });

  //   it('renders menus based on API response', async () => {
  //     mockGetData.mockResolvedValueOnce({
  //       data: [
  //         {
  //           id: 1,
  //           menu_name: 'Test Menu',
  //           submenus: [
  //             { id: 101, menu_name: 'Sub Menu 1' },
  //             { id: 102, menu_name: 'Sub Menu 2' },
  //           ],
  //         },
  //       ],
  //     });

  //     render(
  //       <Router>
  //         <Sidebar />
  //       </Router>,
  //     );

  //     await waitFor(() => {
  //       expect(screen.getByText('Test Menu')).toBeInTheDocument();
  //     });

  //     fireEvent.click(screen.getByText('Test Menu'));

  //     await waitFor(() => {
  //       expect(screen.getByText('Sub Menu 1')).toBeInTheDocument();
  //       expect(screen.getByText('Sub Menu 2')).toBeInTheDocument();
  //     });
  //   });

  it('toggles sidebar hover class on mouse enter and leave', () => {
    render(
      <Router>
        <Sidebar />
      </Router>,
    );

    const sidebar = screen.getByRole('complementary');
    fireEvent.mouseEnter(sidebar);
    expect(document.body.classList.contains('sidebar-hovered')).toBe(true);

    fireEvent.mouseLeave(sidebar);
    expect(document.body.classList.contains('sidebar-hovered')).toBe(false);
  });

  it('renders student-specific menu items when profile completion is 100%', () => {
    render(
      <Router>
        <Sidebar />
      </Router>,
    );

    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Chat History')).toBeInTheDocument();
  });

  //   it('does not render "Chat" or "Chat History" if profile completion is less than 100%', () => {
  //     localStorage.getItem = jest.fn((key) => {
  //       if (key === 'Profile_completion') return '100';
  //       if (key === 'user_type') return 'student';
  //       return null;
  //     });

  //     render(
  //       <Router>
  //         <Sidebar />
  //       </Router>,
  //     );

  //     expect(localStorage.getItem).toHaveBeenCalledWith('Profile_completion');
  //     expect(localStorage.getItem('Profile_completion')).toBe('100');

  //     expect(screen.queryByText('Chat')).not.toBeInTheDocument();
  //     expect(screen.queryByText('Chat History')).not.toBeInTheDocument();
  //   });

  it('renders feedback and FAQ for students', () => {
    render(
      <Router>
        <Sidebar />
      </Router>,
    );

    expect(screen.getByText('Feedback')).toBeInTheDocument();
    expect(screen.getByText('FAQs')).toBeInTheDocument();
  });
});
