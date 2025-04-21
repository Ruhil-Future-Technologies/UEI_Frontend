import { render, screen } from '@testing-library/react';
import React from 'react';
import Chatbot from '..';

jest.mock('react-katex', () => ({
  InlineMath: ({ math }: { math: string }) => <span>{math}</span>,
}));

describe('Chatbot Component', () => {
  it('should render a single string answer correctly', () => {
    const answer = 'This is a simple answer.';
    render(<Chatbot answer={answer} index={0} />);

    expect(screen.getByText('This is a simple answer.')).toBeInTheDocument();
  });

  it('should render an array of strings correctly', () => {
    const answer = ['This is a first part.', 'This is a second part.'];
    const { container } = render(<Chatbot answer={answer} index={0} />);

    const spanElements = container.querySelectorAll('span');

    expect(spanElements[0]).toHaveTextContent('This');
    expect(spanElements[1]).toHaveTextContent('This');
  });

  it('should render an object answer correctly', () => {
    const answer = { answer: 'This is an object answer' };
    const { container } = render(<Chatbot answer={answer} index={0} />);

    const spanElement = container.querySelector('span');
    expect(spanElement).toHaveTextContent('This is an object answer');
  });

  it('should handle LaTeX correctly', () => {
    const answer = 'Here is a LaTeX expression: $$\\frac{1}{2}$$';
    render(<Chatbot answer={answer} index={0} />);

    expect(screen.getByText('\\frac{1}{2}')).toBeInTheDocument();
  });

  it('should render multiple LaTeX expressions correctly', () => {
    const answer = 'First: $$\\frac{1}{2}$$, Second: $$\\frac{2}{3}$$';
    render(<Chatbot answer={answer} index={0} />);

    expect(screen.getByText('\\frac{1}{2}')).toBeInTheDocument();
    expect(screen.getByText('\\frac{2}{3}')).toBeInTheDocument();
  });
  it('should render numbers correctly', () => {
    const answer = 123;
    render(<Chatbot answer={answer} index={0} />);

    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should handle empty answers gracefully', () => {
    const answer = '';
    render(<Chatbot answer={answer} index={0} />);
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('should render answer with both LaTeX and normal text correctly', () => {
    const answer = 'Here is a LaTeX: $$\\frac{1}{2}$$ and some regular text.';
    render(<Chatbot answer={answer} index={0} />);

    expect(screen.getByText('\\frac{1}{2}')).toBeInTheDocument();
    expect(screen.getByText('and some regular text.')).toBeInTheDocument();
  });

  it('should render answer with different elements correctly', () => {
    const answer =
      'Text with **bold** and ##header## and a LaTeX $$\\sqrt{4}$$.';
    render(<Chatbot answer={answer} index={0} />);

    expect(screen.getByText('Text with')).toBeInTheDocument();
    expect(screen.getByText('bold')).toBeInTheDocument();
    expect(screen.getByText('header')).toBeInTheDocument();
    expect(screen.getByText('\\sqrt{4}')).toBeInTheDocument();
  });
});
