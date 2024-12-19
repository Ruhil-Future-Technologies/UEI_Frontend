
import React from "react";
import OpenInFullOutlinedIcon from "@mui/icons-material/OpenInFullOutlined";
import MicIcon from '@mui/icons-material/Mic';
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import robotimg from "../../assets/img/robot.png";
import glogowhite from "../../assets/img/g-logo-white.svg";
import { Link } from "react-router-dom";
const IntitutionChat = () => {
    return (
        <>
            <div className="main-wrapper">

                <div className="main-content">
                    <div className="col-xxl-8 d-flex align-items-stretch">
                        <div className="chat-wrapper desk-chat-wrapper rounded-4 mt-lg-5">

                            <div className="chat-header d-flex align-items-center start-0 rounded-top-4">

                                <div>
                                    <img src={robotimg} className="chatroboimg" alt="" />
                                </div>
                                <div className="chat-top-header-menu ms-auto">
                                    <Link
                                        to={"/main/Chat/recentChat"}
                                        className="btn-outline-primary btn btn-circle rounded-circle d-flex gap-2 wh-32"
                                    >
                                        <OpenInFullOutlinedIcon sx={{ fontSize: "24px" }} />
                                    </Link>

                                </div>
                            </div>
                            <div className="chat-content ms-0 rounded-top-4">
                                <div className="chat-content-rightside">
                                    <div className="d-flex ms-auto">
                                        <div className="flex-grow-1 me-2">

                                            <div className="chat-right-msg">
                                                <span className="anstext"><i className="material-icons-outlined" aria-hidden="true">search</i> Question</span>
                                                <p className="mb-0">
                                                    Give me a description of each one
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="chat-content-leftside">
                                    <div className="d-flex">
                                        <img src={glogowhite} width="38" height="38"
                                            className="rounded-circle p-2 bg-primary" alt="" />
                                        <div className="flex-grow-1 ms-2">
                                            <div className="chat-left-msg">
                                                <span className="anstext"><i className="material-icons-outlined"
                                                    aria-hidden="true">description</i> Answer</span>
                                                <div className="mb-4">
                                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate
                                                        alias iste minima! Illo blanditiis minima aspernatur id iste a!
                                                        Dolore similique voluptate earum dolorem pariatur. Pariatur sint
                                                        aliquam reiciendis minima.</p>

                                                </div>
                                                <ul className="ansfooter">
                                                    <li><i className="material-icons-outlined">thumb_up</i></li>
                                                    <li><i className="material-icons-outlined">thumb_down</i></li>
                                                    <li><i className="material-icons-outlined">content_copy</i> <span>Copy</span></li>
                                                    <li><i className="material-icons-outlined">volume_up</i> <span>Read</span></li>
                                                    <li><i className="material-icons-outlined">cached</i> <span>Regenerate</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="chat-content-rightside">
                                    <div className="d-flex ms-auto">
                                        <div className="flex-grow-1 me-2">

                                            <div className="chat-right-msg">
                                                <span className="anstext"><i className="material-icons-outlined" aria-hidden="true">search</i> Question</span>
                                                <p className="mb-0">
                                                    Give me a description of each one
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="chat-footer d-flex align-items-center start-0 rounded-bottom-4">
                                <div className="flex-grow-1 pe-2">
                                    <div className="input-group"><span className="input-group-text">
                                        <MicIcon />
                                    </span>
                                        <input type="text" className="form-control" placeholder="Type a message" />
                                    </div>
                                </div>
                                <div className="chat-footer-menu">
                                    <Link to="/"
                                        className="btn btn-outline-light btn-circle rounded-circle d-flex gap-2 wh-48">
                                        <ArrowUpwardOutlinedIcon />
                                    </Link>
                                </div>
                            </div>

                            <div className="overlay chat-toggle-btn-mobile"></div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default IntitutionChat;