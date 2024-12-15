import { render, screen} from '@testing-library/react';
import CommonModal from '../index';
import '@testing-library/jest-dom';
import React from 'react';

describe('CommonModal Component', () => {
  const mockSetIsOpen = jest.fn();
  const message = 'This is a test message';

  beforeEach(() => {
    mockSetIsOpen.mockClear();
  });

  it('should render the modal when "isOpen" is true', () => {
    render(
      <CommonModal message={message} isOpen={true} setIsOpen={mockSetIsOpen} />
    );

    // Check if modal content is rendered
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('should not render the modal when "isOpen" is false', () => {
    render(
      <CommonModal message={message} isOpen={false} setIsOpen={mockSetIsOpen} />
    );

    // Ensure modal content is NOT rendered when isOpen is false
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  // it("should close the dialog when Cancel is triggered", () => {
  //   render(
  //     <CommonModal 
  //       message={message} 
  //       isOpen={true} 
  //       setIsOpen={mockSetIsOpen} 
  //     />
  //   );

  //   // Check if Cancel button exists
  //   const cancelButton = screen.getByText("Cancel");
  //   expect(cancelButton).toBeInTheDocument();

  //   // Simulate closing the dialog by clicking the Cancel button
  //   fireEvent.click(cancelButton);

  //   // Assert that setIsOpen was called with false
  //   expect(mockSetIsOpen).toHaveBeenCalledWith(false);
  // });
});
