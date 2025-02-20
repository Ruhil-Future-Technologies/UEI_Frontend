import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '..';

describe('Footer Component', () => {
  it('should render the footer element', () => {
    render(<Footer />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  it('should display the correct copyright text', () => {
    render(<Footer />);
    const copyrightText = screen.getByText(/Copyright © ./i);
    expect(copyrightText).toBeInTheDocument();
  });

  it('should not contain unnecessary elements (commented out)', () => {
    render(<Footer />);
    const additionalText = screen.queryByText(/Designed & developed by/i);
    expect(additionalText).not.toBeInTheDocument();
  });

  it('should have the correct class for styling', () => {
    render(<Footer />);
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveClass('page-footer');
  });

  it('should render without crashing', () => {
    const { container } = render(<Footer />);
    expect(container).toBeInTheDocument();
  });
});
