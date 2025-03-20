import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '..';
import { MemoryRouter } from 'react-router-dom';

describe('Footer Component', () => {
  it('should render the footer element', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  it('should display the correct copyright text', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
    const copyrightText = screen.getByText(/Copyright ©/i);
    expect(copyrightText).toBeInTheDocument();
  });

  it('should not contain unnecessary elements (commented out)', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
    const additionalText = screen.queryByText(/Designed & developed by/i);
    expect(additionalText).not.toBeInTheDocument();
  });

  it('should have the correct class for styling', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toHaveClass('page-footer');
  });

  it('should render without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
    expect(container).toBeInTheDocument();
  });
});
