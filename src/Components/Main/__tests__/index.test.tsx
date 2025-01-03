import { render } from '@testing-library/react';
import Main from '../index';
import React from 'react';
import NameContext from '../../../Pages/Context/NameContext';
import { contextValue } from '../../../MockStorage/mockstorage';
import { BrowserRouter as Router } from 'react-router-dom';
describe('Main Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.speechSynthesis = {
      cancel: jest.fn(),
      speak: jest.fn(),
    } as unknown as SpeechSynthesis;
  });
  test('cancels speech synthesis on mount', () => {
    render(
      <NameContext.Provider value={contextValue}>
        <Router>
          <Main />
        </Router>
      </NameContext.Provider>,
    );
    expect(global.speechSynthesis.cancel).toHaveBeenCalledTimes(1);
  });
});
