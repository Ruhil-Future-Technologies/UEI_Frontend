/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import FlagIcon from '@mui/icons-material/Flag';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import { useTheme } from '@mui/material/styles';
import { ChatTable } from '../../Pages/Chat/Tablechat';
import Chatbot from '../../Pages/Chatbot';
import FullScreenLoader from '../../Pages/Loader/FullScreenLoader';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';

interface ChatMessage {
  question?: string;
  answer?: string;
  diagram_code?: string;
  table_code?: string;
  like_dislike?: boolean | null;
  speak?: boolean;
}
interface ChatComponentProps {
  robotImage: string;
  logo: string;
  chatLogo?: string;
  selectedchat?: ChatMessage[];
  chatLoader?: boolean;
  loaderMsg?: string;
  search?: string;
  setSearch?: (value: string) => void;
  searcherr?: boolean;
  onSearch?: () => void;
  onFlag?: () => void;
  onExpand?: () => void;
  // onRegenerate?: () => void;
  onRegenerate?: (question?: string) => void;
  onSpeak?: (text: string, index: number) => void;
  onStop?: (index: number) => void;
  onCopy?: (index: number) => void;
  onLike?: (index: number) => void;
  onDislike?: (index: number) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  showExpandButton?: boolean;
  showFlagButton?: boolean;
  showFooter?: boolean;
  className?: string;
  flagged?: any;
  isTextCopied?: any;
  likedStates?: any;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  robotImage,
  logo,
  chatLogo,
  selectedchat = [],
  chatLoader = false,
  loaderMsg = '',
  search = '',
  setSearch,
  searcherr = false,
  onSearch,
  onFlag,
  onExpand,
  onRegenerate,
  onSpeak,
  onStop,
  onCopy,
  onLike,
  onDislike,
  onKeyDown,
  showExpandButton = true,
  showFlagButton = true,
  showFooter = true,
  className = '',
  flagged = false,
  isTextCopied,
  likedStates,
}) => {
  const theme = useTheme();
  const chatRef = useRef<HTMLInputElement>(null);
  const handleFlag = () => {
    // setFlagged(!flagged);
    onFlag?.();
  };

  const handleExpandChat = () => {
    onExpand?.();
  };

  return (
    <div
      className={`chat-wrapper desk-chat-wrapper rounded-4 mt-lg-5 ${className}`}
    >
      <div className="chat-header d-flex align-items-center start-0 rounded-top-4">
        <div>
          <img src={robotImage} className="chatroboimg" alt="" />
        </div>
        {showFlagButton && selectedchat?.length > 0 && (
          <div>
            {flagged ? (
              <FlagIcon
                onClick={handleFlag}
                sx={{
                  color: '#9943ec',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                  marginLeft: '120px',
                }}
              />
            ) : (
              <FlagOutlinedIcon
                onClick={handleFlag}
                sx={{
                  cursor: 'pointer',
                  color: 'inherit',
                  transition: 'color 0.3s ease',
                  marginLeft: '120px',
                }}
              />
            )}
          </div>
        )}
        {showExpandButton && (
          <div className="chat-top-header-menu ms-auto">
            <Link
              to={'/teacher-dashboard/chat/recentChat'}
              onClick={handleExpandChat}
              className="btn-outline-primary btn btn-circle rounded-circle d-flex gap-2 wh-32"
            >
              <OpenInFullOutlinedIcon sx={{ fontSize: '24px' }} />
            </Link>
          </div>
        )}
      </div>

      <div className="chat-content ms-0 rounded-top-4">
        {chatLoader && <FullScreenLoader msg={loaderMsg} flag={'chat'} />}

        {selectedchat?.length > 0 ? (
          selectedchat?.map((chat: ChatMessage, index: number) => (
            <React.Fragment key={`chat-${index}`}>
              {chat?.question && (
                <div className="chat-content-rightside">
                  <div className="d-flex ms-auto">
                    <div className="flex-grow-1 me-2">
                      <div className="chat-right-msg">
                        <span className="anstext">
                          <SearchOutlinedIcon sx={{ fontSize: '18px' }} />
                          Question
                        </span>
                        <p className="mb-0">{chat.question}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {chat?.answer && (
                <div className="chat-content-leftside">
                  <div className="d-flex">
                    <img
                      src={logo}
                      width="38"
                      height="38"
                      className="rounded-circle p-2 bg-primary"
                      alt=""
                    />
                    <div className="flex-grow-1 ms-2">
                      <div className="chat-left-msg">
                        <span className="anstext">
                          <DescriptionOutlinedIcon sx={{ fontSize: '20px' }} />{' '}
                          Answer
                        </span>
                        <div className="mb-4">
                          <p>
                            <Chatbot
                              key={chat?.question}
                              answer={chat?.answer}
                              index={index}
                            />
                          </p>
                          {chat?.diagram_code && (
                            <div
                              style={{
                                width: '100%',
                                height: '400px',
                                overflow: 'hidden',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              dangerouslySetInnerHTML={{
                                __html: chat.diagram_code,
                              }}
                            />
                          )}
                          {chat?.table_code && (
                            <ChatTable tableCode={chat?.table_code} />
                          )}
                        </div>
                        <ul className="ansfooter">
                          <li>
                            <ThumbUpAltOutlinedIcon
                              onClick={() => onLike?.(index)}
                              sx={{
                                fontSize: '14px',
                                color:
                                  likedStates[index] === 'liked' ||
                                  chat?.like_dislike === true
                                    ? theme.palette.primary.main
                                    : chat?.like_dislike !== null
                                      ? '#ccc'
                                      : '',
                                cursor:
                                  chat?.like_dislike !== null
                                    ? 'default'
                                    : 'pointer',
                                transform:
                                  likedStates[index] === 'liked' ||
                                  chat?.like_dislike === true
                                    ? 'scale(1.3)'
                                    : 'scale(1)',
                                transition: 'color 0.3s ease',
                                opacity:
                                  chat?.like_dislike !== null &&
                                  chat?.like_dislike !== true
                                    ? 0.5
                                    : 1,
                              }}
                            />
                          </li>
                          <li>
                            <ThumbDownOutlinedIcon
                              onClick={() => onDislike?.(index)}
                              sx={{
                                fontSize: '14px',
                                color:
                                  likedStates[index] === 'disliked' ||
                                  chat?.like_dislike === false
                                    ? theme.palette.primary.main
                                    : chat?.like_dislike !== null
                                      ? '#ccc'
                                      : '',
                                cursor:
                                  chat?.like_dislike !== null
                                    ? 'default'
                                    : 'pointer',
                                transform:
                                  likedStates[index] === 'disliked' ||
                                  chat?.like_dislike === false
                                    ? 'scale(1.3)'
                                    : 'scale(1)',
                                transition: 'color 0.3s ease',
                                opacity:
                                  chat?.like_dislike !== null &&
                                  chat?.like_dislike !== false
                                    ? 0.5
                                    : 1,
                              }}
                            />
                          </li>
                          {/* <li onClick={() => onRegenerate?.()}> */}
                          <li onClick={() => onRegenerate?.(chat.question)}>
                            <CachedOutlinedIcon sx={{ fontSize: '14px' }} />
                            <span>Regenerate</span>
                          </li>
                          {!chat?.speak ? (
                            <li
                              onClick={() =>
                                onSpeak?.(chat.answer || '', index)
                              }
                            >
                              <VolumeUpOutlinedIcon sx={{ fontSize: '14px' }} />
                              <span>Read</span>
                            </li>
                          ) : (
                            <li onClick={() => onStop?.(index)}>
                              <VolumeOffOutlinedIcon
                                sx={{ fontSize: '14px' }}
                              />
                              <span>Stop</span>
                            </li>
                          )}
                          <li onClick={() => onCopy?.(index)}>
                            <ContentCopyOutlinedIcon
                              sx={{ fontSize: '14px' }}
                            />
                            <span>
                              {isTextCopied[`answer-${index}`]
                                ? 'Copied'
                                : 'Copy'}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        ) : (
          <div
            className="d-flex flex-column align-items-center text-center"
            style={{ height: '200px' }}
          >
            {chatLogo && <img width={'200px'} src={chatLogo} alt="" />}
            <h4>Hi, How can I help you today?</h4>
          </div>
        )}
      </div>

      {showFooter && (
        <div className="chat-footer d-flex align-items-center start-0 rounded-bottom-4">
          <div className="flex-grow-1 pe-2">
            <div className="input-group">
              <span className="input-group-text">{/* <MicIcon /> */}</span>
              <input
                type="text"
                className="form-control"
                placeholder="Type your question"
                ref={chatRef}
                value={search}
                onChange={(e) => setSearch?.(e.target.value)}
                onKeyDown={onKeyDown}
              />
            </div>
            {searcherr && (
              <small className="text-danger">Please Enter your query!!</small>
            )}
          </div>
          <div className="chat-footer-menu">
            <button onClick={onSearch}>
              <ArrowUpwardOutlinedIcon />
            </button>
          </div>
        </div>
      )}

      <div className="overlay chat-toggle-btn-mobile"></div>
    </div>
  );
};

export default ChatComponent;
