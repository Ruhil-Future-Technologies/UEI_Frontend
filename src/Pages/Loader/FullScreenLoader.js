/* eslint-disable react/prop-types */
import React from "react";
// import {
//   TailSpin,
//   BallTriangle,
//   Circles,
//   MutatingDots,
//   ThreeDots,
//   Oval,
// } from "react-loader-spinner";
import "./FullScreenLoader.scss"; // Import CSS for styling

const FullScreenLoader = (props) => {
  return (
  <div className={`${ props.flag === 'chat' ? "chat-loader-box" : "loader-box"}`}>
  <div className="spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div className="searchtext">{props.msg}</div>
</div>
  );
};

export default FullScreenLoader;
