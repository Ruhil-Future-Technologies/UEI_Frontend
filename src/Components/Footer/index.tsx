import React from 'react';
// import { Link } from 'react-router-dom';
// import '../Footer/Footer.scss';
import { Link } from 'react-router-dom';

import { List, ListItem } from '@mui/material';

const Footer = () => {
  return (
    <>
      {/* <footer className="footer"> */}
      <footer className="page-footer">
        {/* <div className="footer_inner">
                    <div className="left_part">
                        <div className='copyright'>© Copyright 2023 Symox. All rights reserved.</div>
                    </div>
                    <div className="right_part">
                        <div className='develop_by'>Crafted with &#10084; by Symox</div>
                    </div>    
                </div> */}
        {/* <div className="credits text-white">Designed & developed by <a href="#" target="_blank" className="text-pink"> Sakshem IT Solution Pvt. Ltd.</a></div> */}
        {/* <p className="mb-0">Designed & developed by <a href="#" target="_blank" className="text-pink text-decoration-none"> Sakshem IT Solution Pvt. Ltd.</a></p> */}
        <p className="mb-0">
          Copyright © {new Date().getFullYear()}. All right reserved.
        </p>
        <List
          sx={{ display: 'inline-flex', flexWrap: 'wrap', gap: 2, padding: 0 }}
        >
          <ListItem sx={{ width: 'auto', padding: 0 }}>
            <Link to="/privacypolicy" color="primary">
              Privacy Policy
            </Link>
          </ListItem>
          <ListItem sx={{ width: 'auto', padding: 0 }}>
            <Link to="/refundpolicy" color="primary">
              Refund Policy
            </Link>
          </ListItem>
          <ListItem sx={{ width: 'auto', padding: 0 }}>
            <Link to="/Disclaimer" color="primary">
              Disclaimer
            </Link>
          </ListItem>
          <ListItem sx={{ width: 'auto', padding: 0 }}>
            <Link to="/ServicesAgreement" color="primary">
              End User Aggrement
            </Link>
          </ListItem>
        </List>
      </footer>
    </>
  );
};

export default Footer;
