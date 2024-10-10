import {
  TailSpin,
  BallTriangle,
  Circles,
  MutatingDots,
  ThreeDots,
  Oval,
} from "react-loader-spinner";
import "./FullScreenLoader.scss"; // Import CSS for styling
import { Box, CircularProgress,Typography } from "@mui/material";

const FullScreenLoader = (props) => {
  return (
    // <div className="fullscreen-loader">
    //   <ThreeDots
    //     height="110"
    //     width="110"
    //     color="#0000FF"
    //     radius="1"
    //     visible={true}
    //     strokeWidth={2}
    //   />
    // </div>
    <Box className="fullscreen-loader" sx={{ display: 'flex' }}>
    <CircularProgress  size={50}
        thickness={3.5} />
        <Typography 
        variant="h6" 
        sx={{ marginTop: 2 }} // Adds some space between the spinner and the text
      >
        {props.msg}
      </Typography>
  </Box>
  );
};

export default FullScreenLoader;
