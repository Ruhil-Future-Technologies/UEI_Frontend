// StopSpeechOnRouteChange.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import  useTextToSpeech  from '../Chat/speech'; // update to your actual path

const StopSpeechOnRouteChange = () => {
  const { stopSpeechs } = useTextToSpeech();
  const location = useLocation();

  useEffect(() => {
    stopSpeechs(); 
  }, [location]);

  return null; // invisible component
};

export default StopSpeechOnRouteChange;
