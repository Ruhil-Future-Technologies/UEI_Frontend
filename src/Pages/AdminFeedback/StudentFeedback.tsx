/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import '../Hobby/Hobby.scss';
import useApi from '../../hooks/useAPI';
import { Box, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import {
  IStudentFeedback,
  STUDENT_FEEDBACK_COLUMNS,
} from '../../Components/Table/columns';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEYS_STUDENT_FEEDBACK } from '../../utils/const';
import { toast } from 'react-toastify';
import FullScreenLoader from '../Loader/FullScreenLoader';

const StudentFeedback = () => {
  const FeedbackURL = QUERY_KEYS_STUDENT_FEEDBACK.GET_FEEDBACK;
  const columns = STUDENT_FEEDBACK_COLUMNS;
  const navigate = useNavigate();
  const { getData, loading } = useApi();
  const [dataFeedback, setDataStudent] = useState<IStudentFeedback[]>([]);

  const callAPI = async () => {
    getData(`${FeedbackURL}`)
      .then((data) => {
        if (data?.status) {
          const sortedData = Array.isArray(data?.data?.feedbacks_array)
            ? data?.data?.feedbacks_array.sort((a: any, b: any) => {
              const dateA = new Date(a?.created_at);
              const dateB = new Date(b?.created_at);
              return dateB.getTime() - dateA.getTime();
            })
            : [];
          // Update your state with the sorted data
          setDataStudent(sortedData || []);
        }
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigate('/');
        } else if (e?.response?.code === 404) {
          setDataStudent([]);
        } else {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        }
      });
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <>
      {loading && <FullScreenLoader />}
      <div className="main-wrapper">
        <div className="main-content">
          <div className="card">
            <div className="card-body">
              <div className="table_wrapper">
                <div className="table_inner">
                  <div
                    className="containerbutton"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h6" sx={{ m: 1 }}>
                      <div className="main_title">Student Feedback</div>
                    </Typography>
                  </div>
                  <Box marginTop="10px">
                    <MaterialReactTable
                      columns={columns}
                      data={dataFeedback}
                      enableRowVirtualization
                      positionActionsColumn="first"
                      muiTablePaperProps={{
                        elevation: 0,
                      }}
                      // enableRowActions
                      displayColumnDefOptions={{
                        'mrt-row-actions': {
                          header: 'Actions',
                          size: 150,
                        },
                      }}
                      renderRowActions={() => (
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'nowrap',
                            gap: '0.5',
                            marginLeft: '-5px',
                            width: '140px',
                          }}
                        ></Box>
                      )}
                    />
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentFeedback;
