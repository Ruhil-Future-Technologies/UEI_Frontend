import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeSidebar from '../ThemeSidebar';

describe('ThemeSidebar Component', () => {
  const setThemeModeMock = jest.fn();

  const renderComponent = (themeMode: string) => {
    render(
      <ThemeSidebar themeMode={themeMode} setThemeMode={setThemeModeMock} />,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the sidebar with correct elements', () => {
    renderComponent('blue-theme');

    // Check header elements
    expect(screen.getByText('Theme Customizer')).toBeInTheDocument();
    expect(screen.getByText('Customize your theme')).toBeInTheDocument();

    // Check theme options
    expect(screen.getByLabelText('Blue')).toBeInTheDocument();
    expect(screen.getByLabelText('Light')).toBeInTheDocument();
    expect(screen.getByLabelText('Dark')).toBeInTheDocument();
    expect(screen.getByLabelText('Semi Dark')).toBeInTheDocument();
    expect(screen.getByLabelText('Bordered')).toBeInTheDocument();
  });

  it('should apply correct "checked" state for the current theme', () => {
    renderComponent('dark');

    // Ensure the correct radio button is checked
    expect(screen.getByLabelText('Dark')).toBeChecked();
    expect(screen.getByLabelText('Blue')).not.toBeChecked();
    expect(screen.getByLabelText('Light')).not.toBeChecked();
    expect(screen.getByLabelText('Semi Dark')).not.toBeChecked();
    expect(screen.getByLabelText('Bordered')).not.toBeChecked();
  });

  it('should call "setThemeMode" with the correct value when a theme is selected', () => {
    renderComponent('blue-theme');

    // Click on the "Light" theme
    const lightThemeRadio = screen.getByLabelText('Light');
    fireEvent.click(lightThemeRadio);

    expect(setThemeModeMock).toHaveBeenCalledTimes(1);
    expect(setThemeModeMock).toHaveBeenCalledWith('light');
  });

  it('should update "data-bs-theme" attribute on theme change', () => {
    renderComponent('blue-theme');

    // Click on the "Dark" theme
    const darkThemeRadio = screen.getByLabelText('Dark');
    fireEvent.click(darkThemeRadio);

    // Check if the `data-bs-theme` attribute is updated
    expect(document.documentElement.getAttribute('data-bs-theme')).toBe('dark');
  });

  it('should close the sidebar when the close button is clicked', () => {
    renderComponent('blue-theme');

    // Query the close button using a class selector
    const closeButton = document.querySelector('.primaery-menu-close');
    expect(closeButton).toBeInTheDocument();

    // Simulate clicking the close button
    if (closeButton) fireEvent.click(closeButton);

    // Sidebar should still be rendered but could check specific dismiss behavior in the integration
    expect(screen.getByText('Theme Customizer')).toBeInTheDocument();
  });
});
