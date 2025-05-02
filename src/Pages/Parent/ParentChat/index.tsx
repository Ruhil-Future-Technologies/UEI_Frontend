import React, { useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
//import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import OutlinedFlagOutlinedIcon from '@mui/icons-material/OutlinedFlagOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import glogowhite from '../../../assets/icons/logo-primary.png';

const ParentChat = () => {
  const [showHistory, setShowHistory] = useState(false);
  const toggleRecent = () => {
    setShowHistory(!showHistory);
  };
  return (
    <main className="main-wrapper">
      <div className="main-content">
        <div className="chat-panel">
          <div
            className={`left-side-history ${showHistory ? 'showhistory' : ''}`}
          >
            <div className="d-lg-none mb-4 ms-auto d-flex">
              <button
                onClick={toggleRecent}
                className="btn btn-outline-secondary ms-auto btn-sm d-flex align-items-center justify-content-center"
              >
                <CloseOutlinedIcon />
              </button>
            </div>

            <div className="search-filter">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
              />
              <button className="btn btn-primary">
                <SearchOutlinedIcon />
              </button>
            </div>

            <div className="history-label">Today</div>
            <ul className="history-list">
              <li>
                <div className="d-flex flex-column " role="button">
                  <div className="date">11:02, Yesterday</div>
                  <div className="question">Give me another idea for this</div>
                </div>

                <ul className="action-button">
                  <li role="button">
                    <DeleteOutlinedIcon />
                  </li>
                  <li role="button">
                    <BookmarkOutlinedIcon />
                  </li>
                </ul>
              </li>

              <li>
                <div className="d-flex flex-column " role="button">
                  <div className="date">11:02, Yesterday</div>
                  <div className="question">Give me another idea for this</div>
                </div>
                <ul className="action-button">
                  <li role="button">
                    <DeleteOutlinedIcon />
                  </li>
                  <li role="button">
                    <BookmarkOutlinedIcon />
                  </li>
                </ul>
              </li>

              <li>
                <div className="d-flex flex-column " role="button">
                  <div className="date">11:02, Yesterday</div>
                  <div className="question">Give me another idea for this</div>
                </div>
                <ul className="action-button">
                  <li role="button">
                    <DeleteOutlinedIcon />
                  </li>
                  <li role="button">
                    <BookmarkOutlinedIcon />
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="main-chat-panel">
            <div className="mobile-chat-header d-lg-none">
              <ul>
                <li onClick={toggleRecent}>
                  <SyncAltOutlinedIcon />
                </li>
              </ul>
            </div>
            <div className="inner-panel">
              <div className="chat-header2">
                <button className="btn btn-primary btn-sm d-flex align-items-center gap-1 rounded-pill">
                  <AddOutlinedIcon />
                  New Chat
                </button>
                <button className="btn d-flex align-items-center justify-content-center px-0">
                  <OutlinedFlagOutlinedIcon />
                </button>
              </div>
              <div className="chat-result">
                <ul>
                  <li className="left-chat">
                    <div className="profile-icon">
                      <img src={glogowhite} alt="dgdtdfddh" />
                    </div>
                    <div className="chat-card">
                      <div className="chat-card-header">
                        <span className="anstext">
                          <DescriptionOutlinedIcon /> Answer
                        </span>
                      </div>
                      <div className="chat-card-body">
                        <p>
                          Certainly! Here&apos;s a brief description of each of
                          the famous Renaissance painters listed:
                        </p>
                        <strong>Leonardo da Vinci</strong>
                        <p>
                          A polymath known for his mastery in various fields
                          including painting, sculpture, architecture, science,
                          and engineering. His iconic works include the
                          &quot;Mona Lisa&quot; and &quot;The Last Supper&quot;.
                        </p>
                        <strong>Michelangelo Buonarroti</strong>
                        <p>
                          Renowned for his skill in sculpture, painting, and
                          architecture. His masterpieces include the ceiling of
                          the Sistine Chapel and the sculpture of
                          &quot;David.&quot;
                        </p>
                        <strong>Raphael</strong>
                        <p>
                          Known for his graceful and harmonious style,
                          Raphael&apos;s works include &quot;The School of
                          Athens&quot; and numerous Madonna and Child paintings.
                        </p>
                      </div>
                      <ul className="ansfooter">
                        <li>
                          <ThumbUpAltOutlinedIcon />
                        </li>
                        <li>
                          <ThumbDownAltOutlinedIcon />
                        </li>
                        <li>
                          <ContentCopyOutlinedIcon /> <span>Copy</span>{' '}
                        </li>
                        <li>
                          <VolumeUpOutlinedIcon /> <span>Read</span>
                        </li>
                        <li>
                          <LoopOutlinedIcon /> <span>Regenerate</span>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="right-chat">
                    <div className="chat-card">
                      <div className="chat-card-header">
                        <span className="anstext">
                          <SearchOutlinedIcon /> Question
                        </span>
                      </div>
                      <div className="chat-card-body">
                        <p>
                          Certainly! Here&apos;s a brief description of each of
                          the famous Renaissance painters listed:
                        </p>
                      </div>
                    </div>
                    <div className="profile-icon">
                      <img src={glogowhite} alt="" />
                    </div>
                  </li>
                </ul>
              </div>
              <div className="chat-suggestion">
                <h4>Suggestions</h4>
                <ul className="slider">
                  <li>
                    <ChatOutlinedIcon /> Start my history exam
                  </li>
                  <li>
                    <ChatOutlinedIcon /> What&apos;s the news today
                  </li>
                  <li>
                    <ChatOutlinedIcon /> Test myself
                  </li>
                </ul>
                <div className="dots"></div>
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your question"
                />
                <button className="btn btn-primary">
                  <ArrowUpwardOutlinedIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default ParentChat;
