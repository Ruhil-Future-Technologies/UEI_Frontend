import React from 'react'
import { Link } from 'react-router-dom';
import '../Footer/Footer.scss';

const Footer = () => {
  return (
    <>
      <footer className="footer">
        {/* <div className="footer_inner">
                    <div className="left_part">
                        <div className='copyright'>© Copyright 2023 Symox. All rights reserved.</div>
                    </div>
                    <div className="right_part">
                        <div className='develop_by'>Crafted with &#10084; by Symox</div>
                    </div>    
                </div> */}
        <div className="credits text-white">Designed & developed by <a href="#" target="_blank" className="text-pink"> Sakshem IT Solution Pvt. Ltd.</a></div>
      </footer>
    </>
  )
}

export default Footer
