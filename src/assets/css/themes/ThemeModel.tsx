import React, { useContext } from 'react';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { Button, FormControl } from '@mui/material';
import { MuiColorInput } from "mui-color-input";
import NameContext from '../../../Pages/Context/NameContext';
const ThemeModel = ({ open, handleClose }: any) => {
  const context = useContext(NameContext);
  const {setNamecolor }:any = context;
  const initialState = {
    bodybackground: "",
    bghovercolor: "",
    TitleColor: "",
  };

  const [formData, setFormData] = useState(initialState);

  const handleColorChange = (color: any, name: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: color,
    }));
    if (name === 'bodybackground') {
      document.documentElement?.style.setProperty('--bodybackground', formData?.bodybackground);
      document.documentElement?.style.setProperty('--bodycolor', ' #fff');
      localStorage.setItem('--bodybackground', formData?.bodybackground);
      localStorage.setItem('--bodycolor', '#fff');
    } else if (name === "bghovercolor") {
      document.documentElement.style.setProperty('--bghovercolor', formData?.bghovercolor);
      document.documentElement.style.setProperty('--bodycolor', ' #fff');
      localStorage.setItem('--bghovercolor', formData?.bghovercolor);
      localStorage.setItem('--bodycolor', '#fff');
    } else if (name === "TitleColor") {
      document.documentElement.style.setProperty('--TitleColor', formData?.TitleColor);
      localStorage.setItem('--TitleColor', formData?.TitleColor);
    } else {

    }

    localStorage.setItem('theme', "custom");
  };
  const handleClickSelect = () => {
    if (formData.bodybackground) {
      document.documentElement.style.setProperty('--bodybackground', formData.bodybackground);
    } else if (formData.bghovercolor) {
      document.documentElement.style.setProperty('--bghovercolor', formData.bghovercolor);
    }
  };

  const handleClickthem = (themes: string) => {
    if (themes === "default") {
      // document.documentElement.style.setProperty('--bodybackground', "#346885");
      // document.documentElement.style.setProperty('--bghovercolor', "yellow");
      // document.documentElement?.style.setProperty('--bodycolor', ' blue');
      // document.documentElement.style.setProperty('--TitleColor', "orange");
      // document.documentElement.style.setProperty('--iconcolor', "#fff");
      // localStorage.setItem('--bodybackground', "#2290b3");
      // localStorage.setItem('--bghovercolor', "yellow");
      // localStorage.setItem('--bodycolor', ' blue');
      // localStorage.setItem('--TitleColor', "orange");
      // localStorage.setItem('--iconcolor', "#fff");
      document?.documentElement?.setAttribute('data-theme', themes);
      // document?.documentElement?.style.setProperty('--bodybackground', '#003032');
      // document?.documentElement?.style.setProperty('--bghovercolor', '#024f52');
      // document?.documentElement?.style.setProperty('--bodycolor', '#fff');
      // document?.documentElement?.style.setProperty('--TitleColor', '#495057');
      // document?.documentElement?.style.setProperty('--buttonbgcolor','#003032');
      // localStorage?.setItem('--bodybackground', '#003032');
      // localStorage?.setItem('--bghovercolor', '#024f52');
      // localStorage?.setItem('--bodycolor', '#fff');
      // localStorage?.setItem('--TitleColor', '#495057');
      // localStorage?.setItem('--buttonbgcolor', '#003032');
    } else if (themes === "light") {
      document?.documentElement?.setAttribute('data-theme', themes);
      // document.documentElement.style.setProperty('--bodybackground', "#6f8187");
      // document.documentElement.style.setProperty('--bghovercolor', formData.bghovercolor);
      // document.documentElement?.style.setProperty('--bodycolor', ' #fff');
      // document.documentElement.style.setProperty('--TitleColor', formData?.TitleColor);
      // document.documentElement.style.setProperty('--iconcolor', "#fff");
      // localStorage.setItem('--bodybackground', "#6f8187");
      // localStorage.setItem('--bodycolor', '#fff');
      // localStorage.setItem('--bghovercolor', '#fff');
      // localStorage.setItem('--TitleColor', formData?.TitleColor);
      // localStorage.setItem('--iconcolor', "#fff");
    } 
    
    else if (themes === "dark") {
      document?.documentElement?.setAttribute('data-theme', themes);
      // document.documentElement.style.setProperty('--bodybackground', formData.bodybackground);
      // document.documentElement.style.setProperty('--bghovercolor', formData.bghovercolor);
      // document.documentElement?.style.setProperty('--bodycolor', ' #fff');
      // document.documentElement.style.setProperty('--TitleColor', formData?.TitleColor);
      // localStorage.setItem('--bodybackground', formData?.bodybackground);
      // localStorage.setItem('--bodycolor', '#fff');
      // localStorage.setItem('--bghovercolor', '#fff');
      // localStorage.setItem('--TitleColor', formData?.TitleColor);

    }
    //  else if (themes === "theme4") {
    //   document.documentElement.style.setProperty('--bodybackground', formData.bodybackground);
    //   document.documentElement.style.setProperty('--bghovercolor', formData.bghovercolor);
    //   document.documentElement?.style.setProperty('--bodycolor', ' #fff');
    //   document.documentElement.style.setProperty('--TitleColor', formData?.TitleColor);
    //   localStorage.setItem('--bodybackground', formData?.bodybackground);
    //   localStorage.setItem('--bodycolor', '#fff');
    //   localStorage.setItem('--bghovercolor', '#fff');
    //   localStorage.setItem('--TitleColor', formData?.TitleColor);

    // } 
    else {

    }
    setNamecolor(themes)
    localStorage.setItem('theme', themes);
  };
  //  const handleClickSelect = () => {
  //     const root = document.documentElement;
  //     if (formData.bodybackground) {
  //       root.style.setProperty('--bodybackground', formData.bodybackground);
  //     }
  //     if (formData.bghovercolor) {
  //       root.style.setProperty('--bghovercolor', formData.bghovercolor);
  //     }
  //     // Set the data-theme attribute to custom
  //     root.setAttribute('data-theme', 'custom');
  //     handleClose(); // Optionally close the modal after selection
  //   };
  const handleMouseEnter = (e: React.MouseEvent<HTMLParagraphElement>) => {
    (e.target as HTMLParagraphElement).style.color = "blue";
    (e.target as HTMLParagraphElement).style.backgroundColor = "#818f8c87";
};

const handleMouseLeave = (e: React.MouseEvent<HTMLParagraphElement>) => {
    (e.target as HTMLParagraphElement).style.color = "black";
    (e.target as HTMLParagraphElement).style.backgroundColor = " transparent ";
};
  return (
    <Modal open={open} onClose={handleClose}>
      <div style={{ backgroundColor: 'white', padding: '20px', margin: 'auto', marginTop: '10%', width: '20%', marginLeft: "260px" }}>
        <h4>Select theme</h4>
        <div className="avatar-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {/* <FormControl sx={{ mt: 2 }}>
                            <MuiColorInput
                                isAlphaHidden
                                label="Background Color"
                                name="bodybackground"
                                format="hex"
                                value={formData.bodybackground}
                                onChange={(e) => handleColorChange(e, 'bodybackground')}
                                size="small"
                                variant="outlined"
                            />
                           
                        </FormControl>
                        <FormControl sx={{ mt: 2 }}>
                            <MuiColorInput
                                isAlphaHidden
                                label="Hover Color"
                                name="bghovercolor"
                                format="hex"
                                value={formData.bghovercolor}
                                onChange={(e) => handleColorChange(e, 'bghovercolor')}
                                size="small"
                                variant="outlined"
                            />
                           
                        </FormControl>
                             <FormControl sx={{ mt: 2 }}>
                            <MuiColorInput
                                isAlphaHidden
                                label="Title Color"
                                name="TitleColor"
                                format="hex"
                                value={formData.TitleColor}
                                onChange={(e) => handleColorChange(e, 'TitleColor')}
                                size="small"
                                variant="outlined"
                            />
                           
                        </FormControl> */}
          <div>
            <p style={{ cursor: "pointer", transition: "color 0.3s" }}  
            onClick={() => handleClickthem("default")}
            onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
            >Default </p>
            <p  style={{ cursor: "pointer", transition: "color 0.3s" }} 
             onClick={() => handleClickthem("light")}
             onMouseEnter={handleMouseEnter} 
             onMouseLeave={handleMouseLeave}
             >Light</p>
            <p  style={{ cursor: "pointer", transition: "color 0.3s" }} 
             onClick={() => handleClickthem("dark")}
             onMouseEnter={handleMouseEnter} 
             onMouseLeave={handleMouseLeave}
             >Dark</p>
          
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ThemeModel;