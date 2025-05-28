/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Button, message, Select } from 'antd';
import {
  Add,
  DownloadDoneRounded,
  InfoOutlined,
  TableChart,
} from '@mui/icons-material';
import { IconButton, MenuItem } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
// import DownloadCSVButton from '../Components/DownloadCSVButton';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Dragger from 'antd/es/upload/Dragger';
interface OptionType {
  value: any;
  label: string;
}

interface MainFieldConfig {
  key: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  options: OptionType[];
  isVisible?: boolean;
  placeholder: string;
}

interface RepeatableFieldConfig {
  key: string;
  label: string;
  options: OptionType[];
  placeholder: string;
  getDynamicOptions?: (
    mainFieldValues: { [key: string]: any },
    currentRowValues: { [key: string]: any },
    dynamicData: any,
    entityType: 'school' | 'college',
  ) => OptionType[];
}

interface BulkUploadFormProps {
  title: string;
  mainFields?: MainFieldConfig[];
  repeatableFieldsConfig: RepeatableFieldConfig[];
  onSubmit: (
    formData: FormData,
    mainFieldValues: { [key: string]: any },
    repeatableRowValues: Array<{ [key: string]: any }>,
  ) => void;
  downloadTemplateApiEndpoint: string;
  resetTrigger?: any;
  onRepeatableFieldChange?: (
    fieldKey: string,
    value: any,
    rowIndex: number,
  ) => void;
  dynamicData?: {
    dynamicTeacher?: any[];
    dynamicClasses?: any[];
    dynamicSubject?: any[];
  };
  entityType: 'school' | 'college';
}

const BulkUploadForm: React.FC<BulkUploadFormProps> = ({
    title,
    mainFields = [],
    repeatableFieldsConfig,
    onSubmit,
    downloadTemplateApiEndpoint,
    resetTrigger,
    onRepeatableFieldChange,
    dynamicData,
    entityType,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [repeatableRows, setRepeatableRows] = useState<
    Array<{ [key: string]: any }>
  >([{}]);

  const getMainFieldValues = () => {
    const values: { [key: string]: any } = {};
    mainFields.forEach((field) => {
      if (field.key) {
        values[field.key] = field.value;
      }
    });
    return values;
  };

  const addRow = () => {
    const lastRow = repeatableRows[repeatableRows.length - 1];
    const isLastRowFilled = repeatableFieldsConfig.every(
      (fieldConfig) =>
        lastRow &&
        lastRow[fieldConfig.key] !== undefined &&
        lastRow[fieldConfig.key] !== null,
    );

    if (repeatableRows.length > 0 && !isLastRowFilled) {
      message.warning('Please fill the current row before adding more.');
      return;
    }

    const newRow: { [key: string]: any } = {};
    repeatableFieldsConfig.forEach((fieldConfig) => {
      newRow[fieldConfig.key] = null;
    });

    setRepeatableRows([...repeatableRows, newRow]);
  };

  const deleteRow = (index: number) => {
    const updatedRows = repeatableRows.filter((_: any, i: any) => i !== index);
    setRepeatableRows(updatedRows);
  };

  const handleRepeatableFieldChange = (
    index: number,
    fieldKey: string,
    value: any,
  ) => {
    const newRows = [...repeatableRows];
    newRows[index][fieldKey] = value;

    // If the subject in this row changes, clear the teacher field in the same row
    if (fieldKey === 'subject') {
      newRows[index].teacher = null;
    }

    const updatedRow = newRows[index];
    const isDuplicate = newRows.some(
      (row, i) =>
        i !== index &&
        repeatableFieldsConfig.every(
          (fieldConfig) => row[fieldConfig.key] === updatedRow[fieldConfig.key],
        ) &&
        repeatableFieldsConfig.every(
          (fieldConfig) =>
            updatedRow[fieldConfig.key] !== null &&
            updatedRow[fieldConfig.key] !== undefined,
        ),
    );

    if (isDuplicate) {
      newRows[index][fieldKey] = null;
      message.warning('This combination is already selected.');
      setRepeatableRows([...newRows]);
    } else {
      setRepeatableRows(newRows);
      if (onRepeatableFieldChange) {
        onRepeatableFieldChange(fieldKey, value, index);
      }
    }
  };

  const handleFormSubmit = async () => {
    if (!selectedFile) {
      message.error('Please select a file first');
      return;
    }

    const mainFieldValues = getMainFieldValues();

    const areMainFieldsFilled = mainFields.every(
      (field) =>
        field.isVisible === false ||
        (mainFieldValues[field.key] !== null &&
          mainFieldValues[field.key] !== undefined),
    );
    if (!areMainFieldsFilled) {
      message.error('Please fill all required main fields.');
      return;
    }

    const isAnyRepeatableRowFilledCorrectly = repeatableRows.some((row) =>
      repeatableFieldsConfig.every(
        (fieldConfig) =>
          row[fieldConfig.key] !== null && row[fieldConfig.key] !== undefined,
      ),
    );

    if (repeatableRows.length === 0 || !isAnyRepeatableRowFilledCorrectly) {
      message.error('Please fill at least one row with all required fields.');
      return;
    }

    const hasRepeatableRowDuplicates = repeatableRows.some((row1, index1) =>
      repeatableRows.some(
        (row2, index2) =>
          index1 !== index2 &&
          repeatableFieldsConfig.every(
            (fieldConfig) =>
              row1[fieldConfig.key] !== null &&
              row1[fieldConfig.key] !== undefined,
          ) &&
          repeatableFieldsConfig.every(
            (fieldConfig) => row1[fieldConfig.key] === row2[fieldConfig.key],
          ),
      ),
    );

    if (hasRepeatableRowDuplicates) {
      message.error('Duplicate combinations are not allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    onSubmit(formData, mainFieldValues, repeatableRows);

    setSelectedFile(null);
    setRepeatableRows([{}]);
  };

  const uploadProps = {
    name: 'file',
    accept: '.csv',
    showUploadList: false,
    beforeUpload: (file: File) => {
      // const isCSV = file.type === 'text/csv';
      // if (!isCSV) {
      //     message.error('You can only upload CSV files!');
      //     return false;
      // }
      setSelectedFile(file);
      return false;
    },
  };
  

  useEffect(() => {
    setRepeatableRows([{}]);
    setSelectedFile(null);
  }, [resetTrigger]);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // navigates to the previous page
  };
  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">
            <div className="d-flex align-items-center gap-2">
              <ArrowBackIcon role="button" onClick={handleBack} />
              <a className="text-dark" href="/teacher-dashboard">
                Dashboard
              </a>
            </div>
          </div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item active" aria-current="page">
                  <div className="main_title">{title}</div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="text-center">
              <h3 className="fw-bold mb-2 title-color">
                Collage Data Upload Form
              </h3>
              <p className="mb-4 paragraph-color">
                Import your student information using CSV, Excel, or JSON file
                format
              </p>
            </div>
            <div className="card p-lg-2 shadow4 mb-5">
              <div className="card-body">
                <div className="bulk-upload-container">
                  <div className="infocard">
                    <div className="d-flex gap-2">
                      <InfoOutlined fontSize="small" />
                      <p className="fs-14 mb-0">
                        Select a CSV, Excel, or JSON file from your device.
                        Ensure the file format matches the required data
                        structure. Maximum file size: 10MB. <br></br>
                        <a className="fs-14 mt-1 d-block">
                          <DownloadDoneRounded fontSize="small" /> Download
                          sample data
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* peindiing for download csv  */}
                  {/* <div style={{ marginBottom: '20px' }}>
                        <DownloadCSVButton
                            filename={'student_upload_template.xlsx'}
                            apiEndpoint={downloadTemplateApiEndpoint}
                        />
                    </div>

                    <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }} >
                        {mainFields?.map((fieldConfig) => (
                            fieldConfig.isVisible !== false ? (
                                <Select
                                    key={fieldConfig.key}
                                    style={{ width: 200, marginRight: '10px', marginBottom: '10px' }}
                                    placeholder={fieldConfig.placeholder}
                                    value={fieldConfig.value}
                                    onChange={fieldConfig.onChange}
                                >
                                    {fieldConfig.options.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                    ))}
                                </Select>
                            ) : null
                        ))}

                    {repeatableRows.map((row, rowIndex) => {
                      const mainFieldValues = getMainFieldValues();
                      return (
                        <div
                          key={rowIndex}
                          className="d-flex gap-3 addingbox"
                        >
                          {repeatableFieldsConfig.map((fieldConfig) => {
                            const options = fieldConfig.getDynamicOptions
                              ? fieldConfig.getDynamicOptions(
                                  mainFieldValues,
                                  row,
                                  dynamicData,
                                  entityType,
                                )
                              : fieldConfig.options;
                            return (
                              <Select
                                key={fieldConfig.key}
                                size="large"
                                placeholder={fieldConfig.placeholder}
                                value={row[fieldConfig.key]}
                                onChange={(value) =>
                                  handleRepeatableFieldChange(
                                    rowIndex,
                                    fieldConfig.key,
                                    value,
                                  )
                                }
                              >
                                {options.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            );
                          })}

                          {repeatableRows.length > 1 && (
                            <IconButton
                              onClick={() => deleteRow(rowIndex)}
                              sx={{
                                width: '35px',
                                height: '35px',
                              }}
                            >
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          )}
                        </div>
                      );
                    })}
                  </div>

                     <Button
                    variant="link"
                    color="primary"
                    onClick={addRow}
                    className="mb-3 px-0 ms-auto d-flex align-items-center gap-1"
                  >
                   <Add fontSize='small'/> Add More
                  </Button>

                  

                  <Dragger {...uploadProps} className="mt-3  bg-white">
                    <p className="ant-upload-drag-icon pt-lg-4">
                      <TableChart />
                    </p>
                    <p className="mb-0 fs-14">
                      Click or drag CSV file to this area to upload
                    </p>
                    <p className="text-primary fs-6 mb-0 pb-lg-4">
                      click to browse
                    </p>
                  </Dragger>
                  {selectedFile && (
                    <span style={{ marginTop: '10px', display: 'block' }}>
                      Selected file: {selectedFile.name}
                    </span>
                  )}


               

                  <Button
                    type="primary"
                    onClick={handleFormSubmit}
                    className="d-block w-100 mt-3"
                    size="large"
                    disabled={
                      !selectedFile ||
                      repeatableRows.length === 0 ||
                      !repeatableRows.some((row) =>
                        repeatableFieldsConfig.every(
                          (fieldConfig) =>
                            row[fieldConfig.key] !== null &&
                            row[fieldConfig.key] !== undefined,
                        ),
                      )
                    }
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4"></div>
      </div>
    </div>
  );
};

export default BulkUploadForm;
