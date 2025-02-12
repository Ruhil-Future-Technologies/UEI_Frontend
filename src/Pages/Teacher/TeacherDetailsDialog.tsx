/* eslint-disable @typescript-eslint/no-explicit-any */
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import './TeacherDetailsDialog.scss';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import React, { useState } from 'react';

export const TeacherDetailsDialog = ({
  open,
  selectedTeacher,
  onClose,
}: {
  open: boolean;
  selectedTeacher: any;
  onClose: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const TEACHER_DETAIL_FIELDS = [
    'full_name',
    'dob',
    'gender',
    'email_id',
    'phone',
    'qualification',
    'experience',
    'entity_type',
    'school_name',
    'classes',
    'college_name',
    'university_name',
    'courses',
    'address',
    'city',
    'district',
    'state',
    'country',
    'pincode',
    'created_at',
    'updated_at',
    'documents',
  ];

  const renderClasses = (classes: any) => {
    if (!classes || typeof classes !== 'object') return '';

    return (
      <>
        <div className="dropdown-container">
          <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
            {Object.keys(classes)[0]
              ?.replace('class_', 'Class ')
              .replace('0', '')}
            <span className="dropdown-arrow">
              {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </span>
          </div>
          <div className={`dropdown-content ${isOpen ? 'show' : ''}`}>
            {Object.keys(classes).map((className) => (
              <div
                key={className}
                className="dropdown-item"
                onClick={() => setIsOpen(false)}
              >
                <div>
                  {className.replace('class_', 'Class ').replace('0', '')}
                </div>
                <div className="subjects-list">
                  {renderStreams(classes[className])}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderStreams = (streams: any) => {
    return Object.entries(streams).map(([streamName, subjects]) => (
      <div key={streamName} className="stream-container">
        <strong>
          {streamName.charAt(0).toUpperCase() + streamName.slice(1)}:
        </strong>
        <ul>
          {Array.isArray(subjects) &&
            subjects.map((subject) => <li key={subject}>{subject}</li>)}
        </ul>
      </div>
    ));
  };

  const renderDocuments = (documents: any) => {
    if (!Array.isArray(documents) || documents.length === 0) {
      return 'No documents available';
    }

    return (
      <div style={{ marginLeft: '20px' }}>
        {documents.map((doc, index) => (
          <DocumentLink
            key={index}
            doc={doc}
            isLast={index === documents.length - 1}
          />
        ))}
      </div>
    );
  };

  const renderCourses = (courses: any) => {
    if (!courses || typeof courses !== 'object') return '';
    return (
      <>
        <div className="dropdown-container">
          <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
            {Object.keys(courses)[0]?.replace('course_', 'Course')}
            <span className="dropdown-arrow">
              {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </span>
          </div>
          <div className={`dropdown-content ${isOpen ? 'show' : ''}`}>
            {Object.entries(courses).map(([courseName, semesters]) => (
              <div
                key={courseName}
                className="dropdown-item"
                onClick={() => setIsOpen(false)}
              >
                <div>{courseName.replace('course_', 'Course ')}</div>
                <div className="subjects-list">
                  {' '}
                  {renderSemesters(semesters)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderSemesters = (semesters: any) => {
    if (!semesters || typeof semesters !== 'object') return null;
    return (
      <>
        {Object.entries(semesters).map(([semesterName, subjects]) => (
          <div
            key={semesterName}
            className="semester-container"
            style={{ marginBottom: '4px' }}
          >
            <strong>
              semester{' '}
              {semesterName.charAt(0).toUpperCase() + semesterName.slice(1)}:
            </strong>
            <ul>
              {Array.isArray(subjects) &&
                subjects.map((subject: string) => (
                  <li key={subject}>{subject}</li>
                ))}
            </ul>
          </div>
        ))}
      </>
    );
  };

  const DocumentLink = ({ doc, isLast }: { doc: any; isLast: any }) => (
    <div style={{ margin: '5px 0' }}>
      <a
        href={doc}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'underline' }}
      >
        {doc.split('/').pop()}
      </a>
      {!isLast && ', '}
    </div>
  );

  const renderValue = (key: any, value: any) => {
    switch (key) {
      case 'classes':
        return renderClasses(value);
      case 'courses':
        return renderCourses(value);
      case 'documents':
        return renderDocuments(value);
      default:
        return typeof value === 'object'
          ? JSON.stringify(value)
          : String(value ?? '');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        '& .MuiPaper-root': {
          width: {
            xs: '95%',
            sm: '80%',
            md: '60%',
            lg: '40%',
          },
          maxWidth: '900px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          margin: {
            xs: '10px',
            sm: 'auto',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: {
            xs: '18px',
            sm: '20px',
            md: '22px',
          },
        }}
      >
        Teacher Details
      </DialogTitle>
      <DialogContent>
        <div className="teacher-details">
          {TEACHER_DETAIL_FIELDS.map((key: any) => {
            if (key in selectedTeacher) {
              return (
                <p key={key}>
                  <strong style={{ fontWeight: 500, fontSize: '14px' }}>
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </strong>
                  : {renderValue(key, selectedTeacher[key])}
                </p>
              );
            }
            return null;
          })}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
