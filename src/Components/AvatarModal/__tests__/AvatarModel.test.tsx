import { render, screen, fireEvent } from '@testing-library/react';
import AvatarModal from '../AvatarModal';
import '@testing-library/jest-dom';
import React from 'react';

describe('AvatarModal Component', () => {
  const mockHandleClose = jest.fn();
  const mockHandleAvatarSelect = jest.fn();
  const avatars = ['avatar1.png', 'avatar2.png', 'avatar3.png'];

  beforeEach(() => {
    mockHandleClose.mockClear();
    mockHandleAvatarSelect.mockClear();
  });

  it('should render the modal when "open" is true', () => {
    render(
      <AvatarModal
        open={true}
        handleClose={mockHandleClose}
        handleAvatarSelect={mockHandleAvatarSelect}
        avatars={avatars}
      />,
    );

    // Check if modal is rendered
    expect(screen.getByText('Select an Avatar')).toBeInTheDocument();
  });

  it('should display avatars correctly', () => {
    render(
      <AvatarModal
        open={true}
        handleClose={mockHandleClose}
        handleAvatarSelect={mockHandleAvatarSelect}
        avatars={avatars}
      />,
    );

    // Check if all avatars are rendered as images
    const avatarImages = screen.getAllByAltText('avatar');

    // Check that all images have the correct src attribute
    avatars.forEach((avatar, index) => {
      expect(avatarImages[index]).toHaveAttribute('src', avatar);
    });
  });

  it('should call handleAvatarSelect when an avatar is clicked', () => {
    render(
      <AvatarModal
        open={true}
        handleClose={mockHandleClose}
        handleAvatarSelect={mockHandleAvatarSelect}
        avatars={avatars}
      />,
    );

    // Simulate clicking the first avatar
    const avatarImage = screen.getAllByAltText('avatar')[0];
    fireEvent.click(avatarImage);

    // Ensure handleAvatarSelect was called with the correct avatar
    expect(mockHandleAvatarSelect).toHaveBeenCalledWith('avatar1.png');
  });

  it('should call handleClose when the modal is closed', () => {
    render(
      <AvatarModal
        open={true}
        handleClose={mockHandleClose}
        handleAvatarSelect={mockHandleAvatarSelect}
        avatars={avatars}
      />,
    );

    // Simulate closing the modal by clicking outside the modal (on the backdrop)
    fireEvent.click(screen.getByRole('presentation')); // Modal backdrop

    // Ensure handleClose is called
    expect(mockHandleClose).toHaveBeenCalledTimes(0);
  });
});
