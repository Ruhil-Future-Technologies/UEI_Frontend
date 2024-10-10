import React, { useEffect, useState } from 'react'

import '../Menu/Menu.scss';

import { Box, Typography } from '@mui/material';

const NotFound = () => {

    return (
        <>
            <div className='dashboard' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <Box>
                        <Typography variant="h1" style={{ fontSize: '6rem', fontWeight: 'bold' }}>404</Typography>
                        <Typography variant="h5">Page Not Found</Typography>
                        <Typography variant="h6">You are not authorized to access this page</Typography>
                    </Box>
                </div>
            </div> 
        </>
    )
}

export default NotFound