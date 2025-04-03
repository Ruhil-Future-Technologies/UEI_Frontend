import { Button } from '@mui/material';
import React from 'react';

interface UploadBtnProps {
  label?: string;
  accept?: string;
  name?: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const UploadBtn: React.FC<UploadBtnProps> = ({
  label = 'Upload File',
  name = 'file',
  accept = '*',
  handleFileChange,
}) => {
  return (
    <div className="custbutton">
      <Button
        variant="contained"
        component="label"
        className="custom-button mainbutton"
      >
        {label}
        <input
          type="file"
          name={name}
          accept={accept}
          hidden
          multiple
          onChange={handleFileChange}
        />
      </Button>
    </div>
  );
};

export default UploadBtn;
