import Box from '@mui/material/Box';
//import { MaterialReactTable,  } from 'material-react-table';
import React from 'react';

const TeacherListingByInstitution = () => {
  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="card">
          <div className="card-body">
            <div className="table_wrapper">
              <div className="table-inner">
                <Box>
                  {/* <MaterialReactTable
                                        columns={ }
                                        data={ }
                                        enableRowVirtualization
                                        positionActionsColumn="first"
                                        enableRowActions
                                        muiTablePaperProps={ }
                                        displayColumnDefOptions={{
                                            'mrt-row-actions': {
                                                header: 'Actions',
                                                size: 150,
                                            },
                                        }}
                                        renderRowActions={(row) => (
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexWrap: 'nowrap',
                                                    gap: '0.5',
                                                    marginLeft: '-5px',
                                                    width: '140px',
                                                }}
                                            >
                                                Action 1
                                                Action 2
                                                Action 3
                                            </Box>
                                        )}
                                    /> */}
                </Box>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">Student Listing By Institute</div>
      </div>
    </div>
  );
};

export default TeacherListingByInstitution;
