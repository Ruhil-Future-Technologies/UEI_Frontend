import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';
import useApi from '../../../hooks/useAPI';
import React from 'react';
import AddUniversity from '../AddUniversity';
import { QUERY_KEYS_UNIVERSITY } from '../../../utils/const';

jest.mock('../../../hooks/useAPI');
jest.mock('react-toastify');

describe('AddUniversity Component', () => {
  const mockPostData = jest.fn();
  const mockGetData = jest.fn();
  const mockPutData = jest.fn();

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

  it('renders correctly in Add mode', () => {
    render(
      <MemoryRouter initialEntries={['/main/University/add']}>
        <Routes>
          <Route path="/main/University/add" element={<AddUniversity />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText(/Add University/i)).toBeInTheDocument();
  });

  //   it("renders correctly in Edit mode", () => {
  //     const mockUniversity = { university_name: "University A" };
  //     mockGetData.mockResolvedValue({ data: mockUniversity });

  //     render(
  //       <MemoryRouter initialEntries={["/main/University/edit/1"]}>
  //         <Routes>
  //           <Route path="/main/University/edit/:id" element={<AddUniversity />} />
  //         </Routes>
  //       </MemoryRouter>
  //     );

  //     expect(screen.getByText(/Edit University/i)).toBeInTheDocument();
  //     expect(screen.getByDisplayValue("University A")).toBeInTheDocument();
  //   });

  it('displays validation errors for university name', async () => {
    render(
      <MemoryRouter initialEntries={['/main/University/add']}>
        <Routes>
          <Route path="/main/University/add" element={<AddUniversity />} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText(/Save|Update/i));

    await waitFor(() => {
      expect(
        screen.getByText(/Please enter university name/i),
      ).toBeInTheDocument();
    });
  });

  it('submits the form and shows success toast for Add', async () => {
    mockPostData.mockResolvedValue({
      status: 201,
      message: 'University added successfully!',
    });
    render(
      <MemoryRouter initialEntries={['/main/University/add']}>
        <Routes>
          <Route path="/main/University/add" element={<AddUniversity />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/University Name/i), {
      target: { value: 'University A' },
    });
    fireEvent.click(screen.getByText(/Save|Update/i));

    await waitFor(() => {
      expect(mockPostData).toHaveBeenCalledWith(
        QUERY_KEYS_UNIVERSITY.UNIVERSITY_ADD,
        expect.any(FormData),
      );
      const formDataArg = mockPostData.mock.calls[0][1];
      expect(formDataArg instanceof FormData).toBe(true);
      expect(formDataArg.get('university_name')).toBe('University A');

      expect(toast.success).toHaveBeenCalledWith(
        'University added successfully!',
        expect.any(Object),
      );
    });
  });

  it('submits the form and shows success toast for Edit', async () => {
    const mockUniversity = { university_name: 'University A' };
    mockGetData.mockResolvedValue({ data: mockUniversity });
    mockPutData.mockResolvedValue({
      status: 200,
      message: 'University updated successfully!',
    });

    render(
      <MemoryRouter initialEntries={['/main/University/edit/1']}>
        <Routes>
          <Route path="/main/University/edit/:id" element={<AddUniversity />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockGetData).toHaveBeenCalled();
    });

    const universityInput = screen.getByLabelText(
      /University Name/i,
    ) as HTMLInputElement;
    fireEvent.change(universityInput, {
      target: { value: 'University A Updated' },
    });

    const updateButton = screen.getByText(/Update/i);

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(mockPutData).toHaveBeenCalled();
    });

    const endpointCalled = mockPutData.mock.calls[0]?.[0];

    expect(endpointCalled).toBe(`${QUERY_KEYS_UNIVERSITY.UNIVERSITY_UPDATE}/1`);

    const formDataArg = mockPutData.mock.calls[0]?.[1];

    expect(formDataArg instanceof FormData).toBe(true);
    expect(formDataArg.get('university_name')).toBe('University A Updated');

    expect(toast.success).toHaveBeenCalledWith(
      'University updated successfully!',
      expect.any(Object),
    );
  });

  it('shows error toast when API call fails', async () => {
    mockPostData.mockRejectedValue({ message: 'Error occurred!' });

    render(
      <MemoryRouter initialEntries={['/main/University/add']}>
        <Routes>
          <Route path="/main/University/add" element={<AddUniversity />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/University Name/i), {
      target: { value: 'University A' },
    });
    fireEvent.click(screen.getByText(/Save|Update/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Error occurred!',
        expect.any(Object),
      );
    });
  });

  //   it("navigates after successful form submission", async () => {
  //     const mockNavigate = jest.fn();
  //     mockPostData.mockResolvedValue({
  //       status: 201,
  //       message: "University added successfully!",
  //     });

  //     render(
  //       <MemoryRouter initialEntries={["/main/University/add"]}>
  //         <Routes>
  //           <Route path="/main/University/add" element={<AddUniversity />} />
  //         </Routes>
  //       </MemoryRouter>
  //     );

  //     fireEvent.change(screen.getByLabelText(/University Name/i), {
  //       target: { value: "University A" },
  //     });
  //     fireEvent.click(screen.getByText(/Save/i));

  //     await waitFor(() => {
  //       expect(mockNavigate).toHaveBeenCalledWith("/main/University");
  //     });
  //   });
});
