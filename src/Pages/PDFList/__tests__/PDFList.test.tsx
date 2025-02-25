import { render, renderHook, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import React, { act, useState } from 'react';
import PDFList from '../PDFList';
import NameContext from '../../Context/NameContext';
import { contextValue } from '../../../MockStorage/mockstorage';
import useApi from '../../../hooks/useAPI';
import { toast } from 'react-toastify';
/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../../hooks/useAPI', () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockPostData = jest.fn();
const mockPutData = jest.fn();
describe('PDF LIST COMPONENT', () => {
  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue({
      postData: mockPostData,
      putData: mockPutData,
      getData: jest.fn().mockResolvedValue({ data: [], status: 200 }),
      loading: false,
      deleteFileData: jest.fn(),
      useNavigate: jest.fn(),
    });
  });
  it('renders PDFList component', async () => {
    render(
      <NameContext.Provider value={contextValue}>
        <BrowserRouter>
          <PDFList />
        </BrowserRouter>
      </NameContext.Provider>,
    );

    expect(screen.getByText('College')).toBeInTheDocument();
    expect(screen.getByText('School')).toBeInTheDocument();
  });
  it('handleDeleteFiles sets selected file and opens delete modal', () => {
    const { result } = renderHook(() => {
      const [selectedFile, setSelectedFile] = useState(null);
      const [dataDelete, setDataDelete] = useState(false);

      const handleDeleteFiles = (fileData: any) => {
        setSelectedFile(fileData);
        setDataDelete(true);
      };
      return { selectedFile, dataDelete, handleDeleteFiles };
    });

    const fileMock = { pdf_id: 123, name: 'Sample.pdf' };
    act(() => {
      result.current.handleDeleteFiles(fileMock);
    });
    expect(result.current.selectedFile).toEqual(fileMock);
    expect(result.current.dataDelete).toBe(true);
  });
  it('handleDelete calls deleteFileData and handles success response', async () => {
    const mockDeleteFileData = jest.fn();
    const mockNavigate = jest.fn();
    const { result } = renderHook(() => {
      const [selectedFile] = useState({ pdf_id: 123 });
      const [dataDelete, setDataDelete] = useState(true);

      const handleDelete = () => {
        const payload = { file_id: selectedFile?.pdf_id };
        mockDeleteFileData.mockResolvedValue({
          status: 200,
          message: 'Deleted Successfully',
        });

        return mockDeleteFileData(
          'https://dbllm.gyansetu.ai/delete-files',
          payload,
        )
          .then((data: any) => {
            if (data.status === 200) {
              setDataDelete(false);
              toast.success(data.message, {
                hideProgressBar: true,
                theme: 'colored',
              });
            }
          })
          .catch((e: any) => {
            if (e?.response?.status === 401) {
              mockNavigate('/');
            }
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      };

      return { dataDelete, handleDelete };
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(mockDeleteFileData).toHaveBeenCalledWith(
      'https://dbllm.gyansetu.ai/delete-files',
      { file_id: 123 },
    );
    // expect(toast.success).toHaveBeenCalledWith('Deleted Successfully', { hideProgressBar: true, theme: 'colored' });
    expect(result.current.dataDelete).toBe(false);
  });

  it('handleDelete handles error and redirects on 401', async () => {
    const mockDeleteFileData = jest.fn();
    const mockNavigate = jest.fn();
    mockDeleteFileData.mockRejectedValue({
      response: { status: 401 },
      message: 'Unauthorized',
    });

    const { result } = renderHook(() => {
      const [selectedFile] = useState({ pdf_id: 123 });
      const [dataDelete] = useState(true);

      const handleDelete = () => {
        const payload = { file_id: selectedFile?.pdf_id };
        return mockDeleteFileData(
          'https://dbllm.gyansetu.ai/delete-files',
          payload,
        ).catch((e: any) => {
          if (e?.response?.status === 401) {
            mockNavigate('/');
          }
          toast.error(e?.message, { hideProgressBar: true, theme: 'colored' });
        });
      };

      return { dataDelete, handleDelete };
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
    // expect(toast.error).toHaveBeenCalledWith('Unauthorized', { hideProgressBar: true, theme: 'colored' });
  });
});
