import React from 'react';
import { Tabs, Tab, Box, Paper } from '@mui/material';

const ParentDashboard = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="parentdash">
          <div className="parentprofile"></div>

          <div className="studentstabdata">
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  borderRadius: '50px',
                  padding: '4px',
                  display: 'inline-flex',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  TabIndicatorProps={{ style: { display: 'none' } }}
                  sx={{
                    borderRadius: '50px',
                    minHeight: 'unset',
                  }}
                >
                  <Tab
                    label="Tab One"
                    sx={{
                      borderRadius: '50px',
                      textTransform: 'none',
                      paddingX: 3,
                      paddingY: 1,
                      minHeight: 'unset',
                      backgroundColor: value === 0 ? '#1976d2' : 'transparent',
                      color: value === 0 ? 'white' : 'black',
                      '&:hover': {
                        backgroundColor: value === 0 ? '#1565c0' : '#e0e0e0',
                      },
                    }}
                  />
                  <Tab
                    label="Tab Two"
                    sx={{
                      borderRadius: '50px',
                      textTransform: 'none',
                      paddingX: 3,
                      paddingY: 1,
                      minHeight: 'unset',
                      backgroundColor: value === 1 ? '#1976d2' : 'transparent',
                      color: value === 1 ? 'white' : 'black',
                      '&:hover': {
                        backgroundColor: value === 1 ? '#1565c0' : '#e0e0e0',
                      },
                    }}
                  />
                </Tabs>
              </Paper>
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
