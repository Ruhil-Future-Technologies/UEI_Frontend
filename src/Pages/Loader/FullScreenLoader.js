/* eslint-disable react/prop-types */
import React from 'react';

import './FullScreenLoader.scss'; // Import CSS for styling

const FullScreenLoader = (props) => {
  const getMessage = () => {
    if (props.flag === 'chat') {
      return 'Thinking';
    }
    return props.msg 
  };

  return (
    <div
      className={`${props.flag === 'chat' || props.flag === 'rag' ? 'chat-loader-box' : 'loader-box'}`}
    >
      {(props.flag === 'chat' || props.flag === 'rag') ? (
        <div className="chat-loader">
          <div className="thinking-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="searchtext">{getMessage()}</div>
        </div>
      ) : (
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {/* {props.flag !== 'chat' && props.flag !== 'rag' &&  <div className="searchtext">{props.msg}</div>} */}
      
    </div>
  );
};

export default FullScreenLoader;
