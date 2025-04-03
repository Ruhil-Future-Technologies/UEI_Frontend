import React, { useEffect, useState } from 'react';
import '../ChatList/ChatList.scss';
import useApi from '../../hooks/useAPI';
import { Box, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import {
  CHATLIST_COLUMNS,
  ChatListRep0oDTO,
  MenuListinter,
} from '../../Components/Table/columns';
import { useLocation, useNavigate } from 'react-router-dom';
import { QUERY_KEYS } from '../../utils/const';
import { toast } from 'react-toastify';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { dataaccess } from '../../utils/helpers';

const ChatList = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const Menulist: any = localStorage.getItem('menulist1');
  const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const ChatListURL = QUERY_KEYS.CHAT_LISTGETALL;
  const columns = CHATLIST_COLUMNS;
  const navigate = useNavigate();
  const { getData, loading } = useApi();
  const [dataAll, setDataAll] = useState<ChatListRep0oDTO[]>([]);

  useEffect(() => {
    setFilteredData(
      dataaccess(
        Menulist,
        lastSegment,
        { urlcheck: 'chat list' },
        { datatest: 'chatlist' },
      ),
    );
  }, [Menulist]);

  const callAPI = async () => {
    getData(`${ChatListURL}`)
      .then((data: { data: ChatListRep0oDTO[] }) => {
        if (data?.data) {
          setDataAll(data?.data);
        }
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <>
      {loading && <FullScreenLoader />}
      <div className="dashboard">
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
                        <div className="main_title"> ChatList</div>
                      </Typography>
                    </div>
                    <Box marginTop="10px">
                      <MaterialReactTable
                        columns={columns}
                        // data={filteredData?.[0]?.is_search ? dataCourse : []}
                        data={
                          dataAll !== undefined || null
                            ? filteredData?.form_data?.is_search
                              ? dataAll
                              : []
                            : []
                        }
                        enableRowVirtualization
                        positionActionsColumn="first"
                        muiTablePaperProps={{
                          elevation: 0,
                        }}
                      />
                    </Box>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatList;
