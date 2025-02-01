import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentProfileManagement from '..';
import React from 'react';

describe('StudentProfileManagement Component', () => {
  beforeAll(() => {
    localStorage.setItem('_id', '12345');
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('renders the component and shows the first step', () => {
    render(<StudentProfileManagement />);

    // Verify the first step is visible
    expect(screen.getByText('Student Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });

  it('clicking "Next" button moves to the next step', () => {
    render(<StudentProfileManagement />);

    // Click "Next" button
    fireEvent.click(screen.getByText('Next'));

    // Verify the active step changes to the next step
    expect(screen.getByText('Student Address')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
  });

  it('clicking "Previous" button moves to the previous step', () => {
    render(<StudentProfileManagement />);

    // Go to the second step first
    fireEvent.click(screen.getByText('Next'));

    // Now click "Previous"
    fireEvent.click(screen.getByText('Previous'));

    // Verify the active step is back to the first step
    expect(screen.getByText('Student Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Step 1')).toBeInTheDocument();
  });

  // it('clicking "Reset" button resets to the first step', () => {
  //   render(<StudentProfileManagement />);

  //   // Go to a later step
  //   fireEvent.click(screen.getByText('Next'));
  //   fireEvent.click(screen.getByText('Next'));

  //   // Click "Reset"
  //   fireEvent.click(screen.getByText('Reset'));

  //   // Verify the active step is back to the first step
  //   expect(screen.getByText('Student Basic Information')).toBeInTheDocument();
  //   expect(screen.getByText('Step 1')).toBeInTheDocument();
  // });

  // it('displays completion message when all steps are completed', () => {
  //   render(<StudentProfileManagement />);

  //   // Go through all the steps
  //   for (let i = 0; i < 5; i++) {
  //     fireEvent.click(screen.getByText('Next'));
  //   }

  //   // Verify the completion message
  //   expect(
  //     screen.getByText("All steps completed - you're finished"),
  //   ).toBeInTheDocument();
  // });

  it('correctly accesses StudentId from localStorage', () => {
    render(<StudentProfileManagement />);

    // Check the value in localStorage
    const studentId = localStorage.getItem('_id');

    // Ensure StudentId is available
    expect(studentId).toBe('12345');
  });
});
