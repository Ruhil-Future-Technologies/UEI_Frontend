import React from 'react';
import { Button, message } from 'antd';
import { DownloadOutlined } from '@mui/icons-material';

interface DownloadCSVButtonProps {
    filename: string;
    apiEndpoint: string;
}

const DownloadCSVButton: React.FC<DownloadCSVButtonProps> = ({ filename, apiEndpoint }) => {

    const handleDownloadFromAPI = async () => {
        try {
            const response = await fetch(apiEndpoint);

            if (!response.ok) {
                message.error(`Failed to download CSV. Status: ${response.status}`);
                return;
            }

            const contentDisposition = response.headers.get('Content-Disposition');
            let downloadFilename = filename;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch[1]) {
                    downloadFilename = filenameMatch[1];
                }
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = downloadFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            message.success('CSV file downloaded successfully.');

        } catch (error) {
            message.error('Error downloading CSV file.');
            console.error('Download error:', error);
        }
    };

    return (
        <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadFromAPI}
        >
            Download Example CSV
        </Button>
    );
};

export default DownloadCSVButton; 