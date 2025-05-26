import React from 'react';
import { Button, message } from 'antd';
import { DownloadOutlined } from '@mui/icons-material';
import useApi from '../hooks/useAPI';

interface DownloadCSVButtonProps {
    filename: string;
    apiEndpoint: string;
}

const DownloadCSVButton: React.FC<DownloadCSVButtonProps> = ({ filename, apiEndpoint }) => {
    const { getFile } = useApi();
    const handleDownloadFromAPI = async () => {
        try {
          const response = await getFile(apiEndpoint); // Adjust endpoint if needed
      
          // Extract filename from Content-Disposition header
        //   let filename = 'student_upload_template.xlsx';// fallback
          const contentDisposition = response?.headers?.['content-disposition'];
          if (contentDisposition) {
              const filenameMatch = contentDisposition.match(/filename[^;=\n]*=(['"]?)([^;\n]*)\1/);
              if (filenameMatch && filenameMatch[2]) {
                  filename = decodeURIComponent(filenameMatch[2]);
              }
          }
      
          if (!response) {
            throw new Error('No response received from the API.');
          }
          const blob = response.data; // Axios returns the blob as .data when using responseType: 'blob'
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename; // Use correct filename
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      
          message.success('Excel file downloaded successfully.');
        } catch (error) {
          console.error('Download error:', error);
          message.error('Failed to download Excel file.');
        }
      };
      
    return (
        <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadFromAPI}
        >
            Download Template
        </Button>
    );
};

export default DownloadCSVButton; 