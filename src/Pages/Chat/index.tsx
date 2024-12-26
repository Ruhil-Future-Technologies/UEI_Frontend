import React, { useEffect, useRef, useState } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
import "../Chat/Chat.scss";
import useApi from "../../hooks/useAPI";
import { toast, ToastContentProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  QUERY_KEYS,
  QUERY_KEYS_STUDENT,
  QUERY_KEYS_UNIVERSITY,
} from "../../utils/const";
import FullScreenLoader from "../Loader/FullScreenLoader";
import Chatbot from "../Chatbot";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteDialog } from "../../Components/Dailog/DeleteDialog";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import VolumeOffOutlinedIcon from "@mui/icons-material/VolumeOffOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import SyncAltOutlinedIcon from "@mui/icons-material/SyncAltOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import searchWhite from "../../assets/icons/search-white.svg";
import primaryLogo from "../../assets/icons/logo-primary.png";
import chatLogo from "../../assets/img/chat-logo.svg";
import PerfectScrollbar from "react-perfect-scrollbar";
import "../../assets/css/newstyle.scss";
import "../../assets/css/main.scss";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useTheme } from "@mui/material/styles";

const Chat = () => {
  const userid = localStorage.getItem("_id") || "";
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [studentDetail, setStudentData] = useState<any>();
  const [studentCourse, setStudentCourse] = useState<any>();
  const [searcherr, setSearchErr] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { Id } = useParams();
  const expandedChat = localStorage.getItem("expandedChatData")
    ? JSON.parse(localStorage.getItem("expandedChatData")!)
    : [];

  const [expandedChatData] = useState<any>(expandedChat);

  const [hasInitialExpandedChat, setHasInitialExpandedChat] = useState(false);
  const [hasSavedLocal, setHasSavedLocal] = useState(false);
  const [selectedchat, setSelectedChat] = useState<any>(expandedChat.chats);
  const [savedExpandedChat, setSavedExpandedChat] = useState<any>([]);
  const [expandSearch, setExpandSearch] = useState(false);
  const userdata = JSON.parse(localStorage.getItem("userdata") || "/{/}/");
  const [dataDelete, setDataDelete] = useState(false);
  const [dataflagged, setDataflagged] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState<number>();
  const ChatURL = QUERY_KEYS.CHATADD;
  const ChatRAGURL = QUERY_KEYS.CHATRAGMODEL;
  const ChatOLLAMAURL = QUERY_KEYS.CHATOLLAMA;
  const ChatURLAI = QUERY_KEYS.CHATADDAI;
  const ChatStore = QUERY_KEYS.CHAT_STORE;
  const ChatDELETEURL = QUERY_KEYS.CHATDELETE;
  const chatlisturl = QUERY_KEYS.CHAT_LIST;
  const chataddconversationurl = QUERY_KEYS.CHAT_HISTORYCON;
  const university_list = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITY;
  const StudentGETURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
  const [chat, setchatData] = useState<any>([]);
  const [chatlist, setchatlistData] = useState<any>();
  const [chathistory, setchathistory] = useState<any>([]);
  const [chathistoryrecent, setchathistoryrecent] = useState<any>();
  const [chatsaved, setChatSaved] = useState<boolean>(false);
  const [displayedChat, setDisplayedChat] = useState<any>([]);
  const { postData, getData, deleteData } = useApi();
  const navigate = useNavigate();
  const profileCompletion = localStorage.getItem("Profile_completion") || "0";
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuerystarred, setSearchQuerystarred] = useState("");
  const [showInitialPage, setShowInitialPage] = useState(true);
  const [loaderMsg, setLoaderMsg] = useState("");
  const [isTextCopied, setIsTextCopied] = useState<any>({});
  const synth: SpeechSynthesis = window?.speechSynthesis;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const theme = useTheme();
  const [university_list_data, setUniversity_List_Data] = useState([]);
  const [likedStates, setLikedStates] = useState<{ [key: string]: string }>({});

  synth.onvoiceschanged = () => {
    getVoices();
  };
  if (profileCompletion !== "100") {
    navigate("/*");
  }
  const chatRef = useRef<HTMLInputElement>(null);
  const handlecancel = () => {
    setDataDelete(false);
  };

  useEffect(() => {
    if (expandedChatData.loading) {
      setLoading(true);
      setLoaderMsg(expandedChatData.loaderMessage);

      setStudentData(expandedChatData.studentData);
      setSearch(expandedChatData.pendingQuestion);
      setExpandSearch(true);
    } else {
      setSavedExpandedChat(expandedChatData.chats);
    }

    if (expandedChatData.length > 0 && !hasInitialExpandedChat) {
      setHasInitialExpandedChat(true);
    }
  }, []);

  useEffect(() => {
    if (!expandedChatData.loading) {
      setShowInitialPage(false);
    }
  }, [expandedChat]);

  useEffect(() => {
    if (search) {
      searchData();
      setExpandSearch(false);
    }
  }, [expandSearch]);

  useEffect(() => {
    if (expandedChat.length > 0 && !hasInitialExpandedChat) {
      setHasInitialExpandedChat(true);
    }
  }, [expandedChat]);

  useEffect(() => {
    if (!expandedChat.length) {
      setSelectedChat([]);
    }
    setTimeout(() => {
      if (Id !== undefined) {
        setShowInitialPage(true);
        if (!expandedChat.length) {
          setSelectedChat([]);
        }
        setSearchQuery("");
        setSearchQuerystarred("");
      } else {
        setShowInitialPage(false);
        if (!expandedChat.length) {
          setSelectedChat([]);
        }
        setSearchQuery("");
        setSearchQuerystarred("");
      }
    }, 500);
  }, [Id]);

  const handleUpIconClick = (index: number) => {
    if (selectedchat[index].like_dislike !== null) {
      return;
    }
    setLikedStates((prevStates) => ({
      ...prevStates,
      [index]: "liked",
    }));

    const updatedChat = [...selectedchat];
    updatedChat[index] = {
      ...updatedChat[index],
      like_dislike: true,
    };
    setSelectedChat(updatedChat);
    const chatDataString = localStorage.getItem("chatData");
    if (chatDataString) {
      const chatData = JSON.parse(chatDataString);
      const updatedChatData = chatData.map((item: any) => {
        const isMatch =
          item.question === selectedchat[index].question &&
          JSON.stringify(item.answer) ===
            JSON.stringify(selectedchat[index].answer);

        if (isMatch) {
          return {
            ...item,
            like_dislike: true,
          };
        }
        return item;
      });

      localStorage.setItem("chatData", JSON.stringify(updatedChatData));
      setDisplayedChat(updatedChatData);
    }
  };

  const handleDownIconClick = (index: number) => {
    if (selectedchat[index].like_dislike !== null) {
      return;
    }
    setLikedStates((prevStates) => ({
      ...prevStates,
      [index]: "disliked",
    }));
    const updatedChat = [...selectedchat];
    updatedChat[index] = {
      ...updatedChat[index],
      like_dislike: false,
    };
    setSelectedChat(updatedChat);
    const chatDataString = localStorage.getItem("chatData");
    if (chatDataString) {
      const chatData = JSON.parse(chatDataString);
      const updatedChatData = chatData.map((item: any) => {
        const isMatch =
          item.question === selectedchat[index].question &&
          JSON.stringify(item.answer) ===
            JSON.stringify(selectedchat[index].answer);

        if (isMatch) {
          return {
            ...item,
            like_dislike: false,
          };
        }
        return item;
      });

      localStorage.setItem("chatData", JSON.stringify(updatedChatData));
      setDisplayedChat(updatedChatData);
    }
  };

  const syncChatStates = (chatData: any) => {
    if (selectedchat?.length > 0) {
      const currentQuestion = selectedchat[0]?.question;
      const matchingChat = chatData?.find((chat: any) => {
        const conversation = JSON.parse(chat.chat_conversation);
        return conversation[0]?.question === currentQuestion;
      });

      if (matchingChat) {
        const conversation = JSON.parse(matchingChat.chat_conversation);
        setSelectedChat(
          conversation.map((item: any) => ({
            ...item,
            speak: false,
          }))
        );

        const newLikedStates: { [key: string]: string } = {};
        conversation.forEach((item: any, index: number) => {
          if (item.like_dislike === true) {
            newLikedStates[index] = "liked";
          } else if (item.like_dislike === false) {
            newLikedStates[index] = "disliked";
          }
        });
        setLikedStates(newLikedStates);
      }
    }
  };

  const callAPI = async () => {
    getData(`${StudentGETURL}${userdata ? `/${userdata?.id}` : ""}`)
      .then((data: any) => {
        setStudentData(data?.data);
        if (
          data?.data?.academic_history &&
          Object.keys(data?.data?.academic_history).length > 0
        ) {
          if (data?.data?.academic_history?.institution_type === "college") {
            getData(
              `course/edit/${data?.data?.academic_history?.course_id}`
            ).then((response) => {
              setStudentCourse(response.data.course_name);
            });
          }
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
    getData(`${chatlisturl}/${userdata?.id}`)
      .then((data: any) => {
        if (selectedchat?.length > 0) {
          const currentChat = data?.data?.find((chat: any) => {
            const conversation = JSON.parse(chat.chat_conversation);
            return conversation[0]?.question === selectedchat[0]?.question;
          });

          if (currentChat) {
            const conversation = JSON.parse(currentChat.chat_conversation);
            setSelectedChat(
              conversation?.map((item: any, index: number) => {
                const existingChat = selectedchat[index];
                return {
                  ...item,
                  speak: existingChat?.speak || false,
                  like_dislike: item.like_dislike,
                };
              })
            );
            setLikedStates(
              conversation?.reduce(
                (acc: any, item: any, index: number) => ({
                  ...acc,
                  [index]:
                    item.like_dislike === true
                      ? "liked"
                      : item.like_dislike === false
                      ? "disliked"
                      : "",
                }),
                {}
              )
            );
          }
        }
        setchatlistData(data?.data);
        // setstatredchat(data?.data?.filter((chat: any) => chat?.flagged));
        setchathistory(data?.data);
        setchathistoryrecent(data?.data);
        syncChatStates(data?.data);
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
    getData(`${university_list}`)
      .then((data: any) => {
        setUniversity_List_Data(data?.data || "");
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  };

  const getVoices = () => {
    setVoices(synth.getVoices());
  };

  useEffect(() => {
    callAPI();
    getVoices();
  }, []);

  function getTodaysData(arr: any) {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

    return arr?.filter((item: any) => {
      if (item?.created_at && typeof item.created_at === "string") {
        const itemDate = item.created_at.split(" ")[0]; // Extract 'YYYY-MM-DD' from 'created_at'
        return itemDate === today;
      }
      return false;
    });
  }

  const filterdataCall = async () => {
    if (Id === "recentChat") {
      const parsedChatHistory = await chathistory?.map(
        (chat: { updated_at: string | number | Date }) => ({
          ...chat,
          updated_at: new Date(chat?.updated_at),
        })
      );

      // Sort the chat history by updated_at in descending order
      const sortedChatHistory = parsedChatHistory?.sort(
        (a: { updated_at: any }, b: { updated_at: any }) =>
          b?.updated_at - a?.updated_at
      );

      const chatDataString: any = localStorage?.getItem("chatData");
      const chatmodify = JSON.parse(chatDataString);

      if (chatmodify && chatmodify[0].question !== "") {
        const tadaysChat = getTodaysData(sortedChatHistory);
        const newArray = [...tadaysChat];
        const column = [
          {
            question: chatmodify[0]?.question,
            answer: chatmodify[0]?.answer,
          },
        ];

        const newObject = {
          chat_conversation: JSON.stringify(column),
          chat_title: chatmodify[0]?.question,
          flagged: false,
        };

        newArray.unshift(newObject);
        setchathistory(newArray);
      } else {
        // Get the last 6 chats
        const todaysChat = getTodaysData(sortedChatHistory);
        // Set the filtered chat history
        setchathistory(todaysChat);
      }
    }
  };

  useEffect(() => {
    if (Id === "recentChat") {
      filterdataCall();
    } else {
      setShowInitialPage(false);
      setchathistory(chathistoryrecent);
    }
  }, [Id, chatlist]);

  const speak = (text: string, index: number) => {
    const textArray = Array.isArray(text) ? text : [text];

    // Join the array into a single string
    let cleanedText = textArray.join(" ");
    // Replace multiple spaces with a single space
    cleanedText = cleanedText.replace(/\s+/g, " ");

    // Trim any leading or trailing spaces
    cleanedText = cleanedText.trim();

    // Convert the first letter of the cleaned text to uppercase
    cleanedText = cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1);

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.onerror = () => {};
    // Event listener for when the speech ends
    utterance.onend = () => {
      const updatedChat = [...selectedchat];
      updatedChat[index] = { ...updatedChat[index], speak: false };
      setSelectedChat(updatedChat);
    };

    // console.log("ssssss",cleanedText,voices);
    const voice = voices.find(
      (voice) => voice.name === "Microsoft Mark - English (United States)"
    ) as SpeechSynthesisVoice;
    utterance.rate = 0.9;
    utterance.voice = voice;
    synth.speak(utterance);
    // setSelectedChat({ ...selectedchat, speak: true });
    const updatedChat = [...selectedchat];
    updatedChat[index] = { ...updatedChat[index], speak: true };
    setSelectedChat(updatedChat);
  };

  const stop = (index: number) => {
    // setSelectedChat({ ...selectedchat, speak: false });
    const updatedChat = [...selectedchat];
    updatedChat[index] = { ...updatedChat[index], speak: false };
    setSelectedChat(updatedChat);
    synth.cancel();
  };

  const handleResponse = (data: { data: any }) => {
    const newData = data?.data ? data?.data : data;
    newData.speak = false;
    newData.like_dislike = null;
    // setFilteredProducts(newData);
    // setSelectedChat((prevState: any) => [...prevState, newData]);
    setSelectedChat((prevState: any) => {
      const newState = [...prevState, newData];
      const newIndex = newState.length - 1;
      setLikedStates((prevStates) => ({
        ...prevStates,
        [newIndex]:
          newData.like_dislike === true
            ? "liked"
            : newData.like_dislike === false
            ? "disliked"
            : "",
      }));
      return newState;
    });
    setChatSaved(false);
    setchatData((prevState: any) => [...prevState, newData]);
    setLoading(false);
    setSearch("");
    setShowInitialPage(false);
    getData(`${chatlisturl}/${userdata?.id}`)
      .then((data: any) => {
        setchathistory(data?.data);
        setchatlistData(data?.data);
        // setstatredchat(data?.data?.filter((chat: any) => chat?.flagged));
        setchathistoryrecent(data?.data);
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  };

  const handleError = (e: {
    message:
      | string
      | number
      | boolean
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | Iterable<React.ReactNode>
      | React.ReactPortal
      | ((props: ToastContentProps<unknown>) => React.ReactNode)
      | null
      | undefined;
  }) => {
    setLoading(false);
    toast.error(e?.message, {
      hideProgressBar: true,
      theme: "colored",
    });
  };

  const searchData = () => {
    setSearch("");

    if (search === "") {
      setSearchErr(true);
      return;
    }

    setLoading(true);
    setLoaderMsg("Searching result from knowledge base");
    setSearchErr(false);

    const prompt = studentDetail?.prompt?.replace("**question**", "answer");
    let payload = {};
    // let rag_payload = {};
    if (selectedchat?.question !== "") {
      payload = {
        student_id: userid,
        question: search,
        prompt: prompt,
        // course: studentDetail?.course === null ? "" : studentDetail?.course,
        // course: "class_10",
        course:
          studentDetail?.academic_history?.institution_type === "school"
            ? studentDetail?.class?.name
            : studentCourse,
        stream: studentDetail?.subject,
        chat_hostory: [
          { role: "user", content: selectedchat?.question },
          {
            role: "assistant",
            content: selectedchat?.answer,
          },
        ],
      };
      // rag_payload = {
      //   user_query: search,
      //   student_id: userid,
      // };
    } else {
      payload = {
        student_id: userid,
        question: search,
        prompt: prompt,
        course:
          studentDetail?.academic_history?.institution_type === "school"
            ? studentDetail?.class?.name
            : studentCourse,
        stream: studentDetail?.subject,
      };
      // rag_payload = {
      //   user_query: search,
      //   student_id: userid,
      // };
    }

    const handleResponsereg = (data: { data: any }) => {
      const newData = data;
      // newData.speak = false;
      // setFilteredProducts(newData);
      setSelectedChat((prevState: any) => [...prevState, newData]);
      setChatSaved(false);
      setchatData((prevState: any) => [...prevState, newData]);
      setLoading(false);
      setSearch("");
      getData(`${chatlisturl}/${userdata?.id}`)
        .then((data: any) => {
          setchatlistData(data?.data);
          // setstatredchat(data?.data?.filter((chat: any) => chat?.flagged));
          setchathistory(data?.data);
          setchathistoryrecent(data?.data);
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    };

    postData(`${ChatURL}`, payload)
      .then((data) => {
        // if (data.status === 200) {
        //   handleResponse(data);
        // } else if (data.status === 404) {
        if (data.status === 200 || data.status === 404) {
          // setLoaderMsg("Searching result from knowledge base");
          setLoaderMsg("Searching result from Rag model");

          if (studentDetail?.academic_history?.institution_type === "school") {
            postData(`${ChatRAGURL}`, {
              user_query: search,
              student_id: userid,
              school_college_selection:
                studentDetail.academic_history.institution_type,
              board_selection:
                studentDetail.academic_history.board.toUpperCase(),
              state_board_selection:
                studentDetail.academic_history.state_for_stateboard,
              stream_selection: studentDetail.academic_history.stream,
              class_selection: studentDetail.class.name,
              university_selection: null,
              college_selection: null,
              course_selection: studentDetail?.course,
              year: studentDetail.academic_history.year,
              subject: studentDetail.subject,
            })
              .then((response) => {
                if (response?.status === 200 || response?.status === 402) {
                  function formatAnswer(answer: any) {
                    if (Array.isArray(answer)) {
                      return answer;
                    }
                    if (typeof answer === "object" && answer !== null) {
                      const entries = Object.entries(answer);
                      return [
                        entries
                          .map(([key, value]) => {
                            if (
                              typeof value === "string" &&
                              value.includes("\\frac") &&
                              !value.includes("$")
                            ) {
                              const latexValue = `$${value}$`;
                              return `${key}) ${latexValue}\n`;
                            }
                            return `${key}) ${value}\n`;
                          })
                          .join(""),
                      ];
                    }
                    return [answer.toString()];
                  }
                  const formattedResponse = {
                    data: {
                      question: response.question,
                      answer: formatAnswer(response.answer),
                    },
                  };
                  const ChatStorepayload = {
                    student_id: userid,
                    chat_question: response.question,
                    response: formatAnswer(response.answer),
                  };
                  if (response?.status !== 402) {
                    postData(`${ChatStore}`, ChatStorepayload).catch(
                      handleError
                    );
                  }
                  handleResponse(formattedResponse);
                } else {
                  setLoaderMsg("Fetching Data from Ollama model.");

                  postData(`${ChatOLLAMAURL}`, {
                    user_query: search,
                    student_id: userid,
                    class_or_course_selection: studentDetail.class.name,
                  })
                    .then((response) => {
                      if (response?.status === 200) {
                        handleResponse(response);
                        const ChatStorepayload = {
                          student_id: userid,
                          chat_question: search,
                          response: response?.answer,
                        };
                        postData(`${ChatStore}`, ChatStorepayload).catch(
                          handleError
                        );
                      }
                    })
                    .catch(() => {
                      postData(`${ChatURLAI}`, payload)
                        .then((response) => handleResponse(response))
                        .catch((error) => handleError(error));
                    });
                }
              })
              .catch(() =>
                // getData(
                //   // `http://13.232.96.204:5000//ollama-chat?user_query=${search}`
                //   `https://dbllm.gyansetu.ai/ollama-chat?user_query=${encodeURIComponent(
                //     search
                //   )}?student_id=${encodeURIComponent(userid)}?class_or_course_selection=${encodeURIComponent(studentDetail?.class.name)}`
                // )
                postData(`${ChatOLLAMAURL}`, {
                  user_query: search,
                  student_id: userid,
                  class_or_course_selection: studentDetail?.class.name,
                })
                  .then((response) => {
                    if (response?.status === 200) {
                      handleResponse(response);
                      const ChatStorepayload = {
                        student_id: userid,
                        chat_question: search,
                        response: response?.answer,
                      };
                      postData(`${ChatStore}`, ChatStorepayload).catch(
                        handleError
                      );
                    }
                  })
                  .catch(() => {
                    postData(`${ChatURLAI}`, payload)
                      .then((response) => handleResponse(response))
                      .catch((error) => handleError(error));
                  })
              );
          } else {
            const {
              institution_type,
              board,
              state_for_stateboard,
              stream,
              class_id,
              university_id,
              year,
              institution_name,
            } = studentDetail?.academic_history || {};
            const { subject_name, course_name } =
              studentDetail?.subject_preference || {};

            // return getData(
            //   `https://dbllm.gyansetu.ai/rag-model?user_query=${search}&student_id=${userid}`
            // )
            const university: any =
              university_list_data.filter(
                (university: any) => university.university_id == university_id
              ) || "";
            const queryParams = {
              user_query: search,
              student_id: userid,
              school_college_selection: institution_type || null,
              board_selection: board || null,
              state_board_selection: state_for_stateboard || null,
              stream_selection: stream || null,
              class_selection: class_id || null,
              university_selection: university[0].university_name || null,
              college_selection: institution_name || null,
              course_selection: studentDetail?.course || null,
              year: year || null,
              subject: subject_name || null,
            };
            // return getData(
            //   `https://dbllm.gyansetu.ai/rag-model?${queryParams.toString()}`
            // )
            return postData(`${ChatRAGURL}`, queryParams)
              .then((response) => {
                if (response?.status === 200 || response?.status === 402) {
                  function formatAnswer(answer: any) {
                    if (Array.isArray(answer)) {
                      return answer;
                    }
                    if (typeof answer === "object" && answer !== null) {
                      const entries = Object.entries(answer);
                      return [
                        entries
                          .map(([key, value]) => {
                            if (
                              typeof value === "string" &&
                              value.includes("\\frac") &&
                              !value.includes("$")
                            ) {
                              const latexValue = `$${value}$`;
                              return `${key}) ${latexValue}\n`;
                            }
                            return `${key}) ${value}\n`;
                          })
                          .join(""),
                      ];
                    }
                    return [answer.toString()];
                  }
                  const formattedResponse = {
                    data: {
                      question: response.question,
                      answer: formatAnswer(response.answer),
                    },
                  };
                  const ChatStorepayload = {
                    student_id: userid,
                    chat_question: response.question,
                    response: formatAnswer(response.answer),
                  };
                  if (response?.status !== 402) {
                    postData(`${ChatStore}`, ChatStorepayload).catch(
                      handleError
                    );
                  }
                  handleResponse(formattedResponse);
                } else {
                  setLoaderMsg("Fetching Data from Ollama model.");
                  // getData(
                  //   // `http://13.232.96.204:5000//ollama-chat?user_query=${search}`
                  //   `https://dbllm.gyansetu.ai/ollama-chat?user_query=${encodeURIComponent(
                  //     search
                  //   )}?student_id=${encodeURIComponent(userid)}?class_or_course_selection=${encodeURIComponent(course_id)}`
                  // )

                  postData(`${ChatOLLAMAURL}`, {
                    user_query: search,
                    student_id: userid,
                    class_or_course_selection: course_name,
                  })
                    .then((response) => {
                      if (response?.status === 200) {
                        handleResponse(response);
                        const ChatStorepayload = {
                          student_id: userid,
                          chat_question: search,
                          response: response?.answer,
                        };
                        postData(`${ChatStore}`, ChatStorepayload).catch(
                          handleError
                        );
                      }
                    })
                    .catch(() => {
                      postData(`${ChatURLAI}`, payload)
                        .then((response) => handleResponse(response))
                        .catch((error) => handleError(error));
                    });
                }
              })
              .catch(() => {
                setLoaderMsg("Fetching Data from Ollama model.");
                // getData(
                //   // `http://13.232.96.204:5000//ollama-chat?user_query=${search}`
                //   `https://dbllm.gyansetu.ai/ollama-chat?user_query=${encodeURIComponent(
                //     search
                //   )}?student_id=${encodeURIComponent(userid)}?class_or_course_selection=${encodeURIComponent(course_id)}`
                // )
                postData(`${ChatOLLAMAURL}`, {
                  user_query: search,
                  student_id: userid,
                  class_or_course_selection: course_name,
                })
                  .then((response) => {
                    if (response?.status === 200) {
                      handleResponse(response);
                      const ChatStorepayload = {
                        student_id: userid,
                        chat_question: search,
                        response: response?.answer,
                      };
                      postData(`${ChatStore}`, ChatStorepayload).catch(
                        handleError
                      );
                    }
                  })
                  .catch(() => {
                    postData(`${ChatURLAI}`, payload)
                      .then((response) => handleResponse(response))
                      .catch((error) => handleError(error));
                  });
              });
          }
        } else {
          handleError(data);
        }
      })
      .then((data: any) => {
        if (data?.status === 200) {
          const ChatStorepayload = {
            student_id: userid,
            chat_question: search,
            response: data?.answer,
          };

          postData(`${ChatStore}`, ChatStorepayload)
            .then((data) => {
              if (data?.status === 200) {
                // handleResponse(data);
              } else if (data) {
                // handleError(data);
              }
            })
            .catch(handleError);

          handleResponsereg(data);
        } else if (data?.status === 404) {
          // const Ollamapayload = {
          //   user_query: search,
          // };
          // return postData(`${ChatURLOLLAMA}`, Ollamapayload);
          setLoaderMsg("Fetching Data from Ollama model.");
          // return getData(
          //   `https://dbllm.gyansetu.ai/ollama-chat?user_query=${encodeURIComponent(
          //     search
          //   )}?student_id=${encodeURIComponent(userid)}?class_or_course_selection=${encodeURIComponent(studentDetail?.academic_history?.institution_type === "school" ? studentDetail?.class.name : studentDetail?.academic_history?.course_id)}`
          // );
          return postData(`${ChatOLLAMAURL}`, {
            user_query: search,
            student_id: userid,
            class_or_course_selection:
              studentDetail?.academic_history?.institution_type === "school"
                ? studentDetail?.class.name
                : studentDetail?.subject_preference?.course_name,
          });
        } else if (data) {
          handleError(data);
        }
      })
      .then((data) => {
        if (data?.status === 200) {
          // handleResponse(data);
          const ChatStorepayload = {
            student_id: userid,
            chat_question: search,
            response: data?.answer,
          };

          postData(`${ChatStore}`, ChatStorepayload)
            .then((data) => {
              if (data?.status === 200) {
                // handleResponse(data);
              } else if (data) {
                // handleError(data);
              }
            })
            .catch(handleError);
          handleResponsereg(data);
        } else if (data?.status === 404) {
          setLoaderMsg("Fetching data from Chat-GPT API.");
          return postData(`${ChatURLAI}`, payload);
        } else if (data) {
          handleError(data);
        }
      })
      .then((data) => {
        if (data?.status === 200) {
          handleResponse(data);
        } else if (data) {
          handleError(data);
        }
      })
      .catch(handleError);
  };

  useEffect(() => {
    if (dataflagged) {
      // setSelectedChat([intials]);
      setSelectedChat([]);
      // if (!expandedChat.length) {
      //   setSelectedChat([]);
      // }
    }
  }, [dataflagged]);

  // useEffect(() => {
  //   if (chat?.length > 0) {
  //     console.log({ displayChat });
  //     console.log({ chat });
  //     console.log("useEffect called at 717");
  //     localStorage.setItem(
  //       "chatData",
  //       JSON.stringify(chat?.length ? chat : displayedChat)
  //     );
  //   }
  // }, [chat]);

  // let chatData: any;
  // useEffect(() => {
  //   const chatDataString = localStorage?.getItem("chatData");

  //   if (chatDataString) {
  //     chatData = JSON.parse(chatDataString);
  //   } else {
  //     chatData = null;
  //   }

  //   if (chatData?.length > 0 && !hasInitialExpandedChat) {
  //     console.log("Chat Data Dependency ======>>>>>>", chatData);
  //     console.log("save chat local gets called in chat index.tsx");
  //     saveChatlocal();
  //   }
  // }, [chatData]);
  useEffect(() => {
    if (chat?.length > 0) {
      const existingChatData = localStorage.getItem("chatData");
      const parsedExistingChat = existingChatData
        ? JSON.parse(existingChatData)
        : [];
      const latestChatItem = chat[chat.length - 1];
      const isAlreadyInExisting = parsedExistingChat.some(
        (item: any) =>
          item.question === latestChatItem.question &&
          JSON.stringify(item.answer) === JSON.stringify(latestChatItem.answer)
      );

      if (!isAlreadyInExisting) {
        let updatedChatData;

        if (savedExpandedChat && savedExpandedChat.length > 0) {
          const isInSavedExpanded = savedExpandedChat.some(
            (item: any) =>
              item.question === latestChatItem.question &&
              JSON.stringify(item.answer) ===
                JSON.stringify(latestChatItem.answer)
          );

          updatedChatData = isInSavedExpanded
            ? [...savedExpandedChat]
            : [...savedExpandedChat, latestChatItem];
        } else {
          updatedChatData = [...parsedExistingChat, latestChatItem];
        }

        localStorage.setItem("chatData", JSON.stringify(updatedChatData));
      }
    }
  }, [chat, savedExpandedChat]);

  let chatData: any;

  useEffect(() => {
    if (hasSavedLocal) {
      return;
    }

    const chatDataString = localStorage?.getItem("chatData");
    const chatData = chatDataString ? JSON.parse(chatDataString) : null;

    if (chatData?.length > 0) {
      if (savedExpandedChat.length > 0) {
        setHasSavedLocal(true);
        return;
      }

      if (!hasInitialExpandedChat) {
        saveChatlocal();
        setHasSavedLocal(true);
      }
    }
  }, [chatData, savedExpandedChat, hasInitialExpandedChat, hasSavedLocal]);

  const saveChatlocal = async () => {
    const chatDataString = localStorage?.getItem("chatData");
    const chatflagged = localStorage?.getItem("chatsaved");
    // console.log("chatData testing save",chatDataString);
    const isChatFlagged = chatflagged === "true";
    let chatData: any;

    if (chatDataString) {
      chatData = JSON.parse(chatDataString);
    } else if (displayedChat?.length > 0) {
      chatData = displayedChat;
    } else {
      chatData = null;
    }

    let datatest;
    if (chatlist !== undefined) {
      datatest = chatlist?.filter(
        (chatitem: { chat_title: any }) =>
          chatitem?.chat_title === chatData?.[0]?.question
      );
    }

    let chat_payload;
    if (
      datatest?.length !== 0 &&
      Array.isArray(chatData) &&
      chatData.length >= 2
    ) {
      // chatData?.shift();
      chat_payload = {
        student_id: userdata.id,
        chat_title: chatData?.[0]?.question,
        chat_conversation: JSON.stringify(chatData),
        flagged: isChatFlagged,
      };
    } else {
      chat_payload = {
        student_id: userdata.id,
        chat_title: chatData?.[0]?.question,
        chat_conversation: JSON.stringify(chatData),
        flagged: isChatFlagged,
      };
    }
    // postData(`${chataddurl}`, chat_payload)
    await postData(`${chataddconversationurl}`, chat_payload)
      .then(() => {
        // setChatSaved(false);
        // toast.success(chatdata?.message, {
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
        callAPI();
        localStorage.removeItem("chatData");
        localStorage.removeItem("chatsaved");
      })
      .catch(() => {
        // toast.error(e?.message, {
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
      });
  };

  const saveChat = async () => {
    // alert("called!!");
    let datatest;
    if (chatlist !== undefined) {
      datatest = chatlist?.filter(
        (chatitem: { chat_title: any }) =>
          chatitem?.chat_title === chat[0]?.question
      );
    }

    let chat_payload;
    if (datatest?.length !== 0 && Array.isArray(chat) && chat.length >= 2) {
      // chat?.shift();
      chat_payload = {
        student_id: userdata.id,
        chat_title: chat[0]?.question,
        chat_conversation: JSON.stringify(chat),
        flagged: chatsaved,
      };
    } else {
      chat_payload = {
        student_id: userdata.id,
        chat_title: chat[0]?.question,
        chat_conversation: JSON.stringify(chat),
        flagged: chatsaved,
      };
    }
    // postData(`${chataddurl}`, chat_payload)
    await postData(`${chataddconversationurl}`, chat_payload)
      .then((chatdata: any) => {
        setChatSaved(false);
        toast.success(chatdata?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
        localStorage.removeItem("chatData");
        localStorage.removeItem("chatsaved");
        callAPI();
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  };

  // useEffect(() => {
  //   setFilteredProducts([]);
  // }, []);

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") {
      searchData();
    }
  };

  const newchat = async () => {
    setShowInitialPage(true);
    if (chat.length > 0) {
      await saveChat();
    }
    setSelectedChat([]);

    //     setSelectedChat([{
    //   "answer": [
    //     "Welcome",
    //     "to",
    //     "GYAN",
    //     "Setu",
    //     "Chat",
    //     "!",
    //     "How",
    //     "can",
    //     "I",
    //     "assist",
    //     "you",
    //     "today",
    //     "?"
    //   ],
    // },])
    setDataflagged(true);
    setTimeout(() => {
      setDataflagged(false);
    }, 100);
    setchatData([]);
    setChatSaved(false);
    setSearch("");
    setSearchErr(false);
    synth.cancel();
    if (chatRef?.current) {
      chatRef?.current.focus();
      chatRef?.current.scrollIntoView();
    }
  };
  // const displayChat = async (chats: any) => {
  //   const initialLikedStates: { [key: string]: string } = {};
  //   setShowInitialPage(false);
  //   const datatest = chatlist.filter(
  //     (chatitem: { chat_title: any }) =>
  //       chatitem.chat_title === chat[0]?.question
  //   );

  //   if (datatest.length === 0 && chat[0]?.question !== undefined) {
  //     await saveChat();
  //   } else if (Array.isArray(chat) && chat.length >= 2) {
  //     await saveChat();
  //   } else {
  //     //empty
  //   }
  //   setchatData([]);
  //   const chatt = JSON.parse(chats?.chat_conversation);
  //   setDisplayedChat(chatt);

  //   setSelectedChat([]);

  //   const chatdataset: any[] = [];
  //   chatt.map((itemchat: any, index: number) => {
  //     // setTimeout(() => {
  //     const chatdata: any = {};
  //     chatdata.question = itemchat?.question;
  //     // chatdata.answer = chat?.response
  //     let elements: any = [];
  //     try {
  //       if (typeof itemchat?.answer === "string") {
  //         elements = JSON.parse(itemchat?.answer);
  //       } else {
  //         elements = itemchat?.answer;
  //       }
  //     } catch {
  //       const cleanString = itemchat?.answer
  //         .replace(/\\"/g, '"')
  //         .replace(/[{}]/g, "")
  //         .replace(/\\'/g, "'")
  //         .replace(/(^"|"$)/g, "");
  //       // .replace(/(^"|"$)/g, "");
  //       const stringArray = cleanString
  //         .split(",")
  //         .map((item: any) => item.trim());
  //       elements = stringArray.map((item: any) => item.replace(/"/g, ""));
  //     }
  //     chatdata.answer = elements;
  //     chatdata.speak = false;
  //     chatdata.like_dislike = itemchat?.like_dislike;
  //     chatdataset.push(chatdata);

  //     if (itemchat?.like_dislike === true) {
  //       initialLikedStates[index] = "liked";
  //     } else if (itemchat?.like_dislike === false) {
  //       initialLikedStates[index] = "disliked";
  //     }
  //     // }, 500);
  //   });
  //   setSelectedChat(chatdataset);
  //   setLikedStates(initialLikedStates);
  // };

  const displayChat = async (chats: any) => {
    const initialLikedStates: { [key: string]: string } = {};
    setShowInitialPage(false);

    const datatest = chatlist.filter(
      (chatitem: { chat_title: any }) =>
        chatitem.chat_title === chat[0]?.question
    );
    if (datatest.length === 0 && chat[0]?.question !== undefined) {
      await saveChat();
    } else if (Array.isArray(chat) && chat.length >= 2) {
      await saveChat();
    } else {
      // empty
    }

    setchatData([]);
    const chatt = JSON.parse(chats?.chat_conversation);
    setDisplayedChat(chatt);
    setSelectedChat([]);

    const chatdataset: any[] = [];

    chatt.map((itemchat: any, index: number) => {
      const chatdata: any = {};
      chatdata.question = itemchat?.question;

      let elements: any;
      if (Array.isArray(itemchat?.answer)) {
        elements = [itemchat.answer.join(" ")];
      } else if (typeof itemchat?.answer === "string") {
        try {
          elements = JSON.parse(itemchat?.answer);
        } catch {
          elements = itemchat?.answer;
        }
      } else {
        elements = itemchat?.answer;
      }

      chatdata.answer = elements;
      chatdata.speak = false;
      chatdata.like_dislike = itemchat?.like_dislike;
      chatdataset.push(chatdata);

      if (itemchat?.like_dislike === true) {
        initialLikedStates[index] = "liked";
      } else if (itemchat?.like_dislike === false) {
        initialLikedStates[index] = "disliked";
      }
    });

    setSelectedChat(chatdataset);
    setLikedStates(initialLikedStates);
  };

  const handleDeleteFiles = (id: number | undefined) => {
    setDataDeleteId(id);
    setDataDelete(true);
  };
  const handleDelete = (id: number | undefined) => {
    deleteData(`${ChatDELETEURL}/${id}`)
      .then((data: { message: string }) => {
        if (
          chatlist?.find((chat: any) => chat.id === id)?.chat_title ===
          selectedchat?.[0]?.question
        ) {
          localStorage.removeItem("expandedChatData");
          setSelectedChat([]);
        }
        toast.success(data?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
        localStorage.removeItem("chatData");

        callAPI();

        setDataDelete(false);
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          navigate("/");
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  };

  const saveChatstar = () => {
    setChatSaved(!chatsaved);
    localStorage.setItem("chatsaved", JSON.stringify(!chatsaved));
    saveChatlocal();
  };

  // const isSmallScreen = useMediaQuery("(max-width:600px)");
  // const isMediumScreen = useMediaQuery(
  //   "(min-width:601px) and (max-width:1200px)"
  // );

  // let fontSize = "27px";

  // if (isSmallScreen) {
  //   fontSize = "18px";
  // } else if (isMediumScreen) {
  //   fontSize = "22px";
  // } else {
  //   //empty
  // }
  //   let statredchat:any =[];
  //   let chathistory:any =[];
  // useEffect(()=>{

  //      statredchat = chatlist?.filter((chat:any)=>chat?.flagged)
  //      chathistory = chatlist?.data?.filter((chat:any)=>!chat?.flagged)

  // },[chatlist,statredchat,chathistory])
  // console.log("test starred",statredchat,chatlist,selectedchat)

  // const toggleStarredChat = () => setIsStarredChatOpen(!isStarredChatOpen);
  // const toggleChatHistory = () => setIsChatHistoryOpen(!isChatHistoryOpen);

  const regenerateChat = (question: any) => {
    setLoading(true);
    setLoaderMsg("Fetching Data from Ollama model.");
    setSearchErr(false);

    const prompt = studentDetail?.prompt?.replace("**question**", "answer");
    let payload = {};

    if (selectedchat?.question !== "") {
      payload = {
        question: question,
        prompt: prompt,
        // course: studentDetail?.course === null ? "" : studentDetail?.course,
        // course: "class_10",
        course:
          studentDetail?.academic_history?.institution_type === "school"
            ? studentDetail?.class?.name
            : studentCourse,
        stream: studentDetail?.subject,
        chat_hostory: [
          { role: "user", content: selectedchat?.question },
          {
            role: "assistant",
            content: selectedchat?.answer,
          },
        ],
      };
    } else {
      payload = {
        question: question,
        prompt: prompt,
        course: studentDetail?.course === null ? "" : studentDetail?.course,
        stream: studentDetail?.subject,
      };
    }

    // getData(
    //   // `http://13.232.96.204:5000//ollama-chat?user_query=${search}`
    //   `https://dbllm.gyansetu.ai/ollama-chat?user_query=${encodeURIComponent(
    //     question
    //   )}?student_id=${encodeURIComponent(userid)}?class_or_course_selection=${encodeURIComponent(studentDetail?.academic_history?.institution_type === "school" ?studentDetail?.class?.name: studentDetail?.academic_history?.course_id)}`
    // )
    postData(`${ChatOLLAMAURL}`, {
      user_query: question,
      student_id: userid,
      class_or_course_selection:
        studentDetail?.academic_history?.institution_type === "school"
          ? studentDetail?.class.name
          : studentDetail?.subject_preference?.course_name,
    })
      .then((response) => {
        if (response?.status === 200) {
          handleResponse(response);
          const ChatStorepayload = {
            student_id: userid,
            chat_question: question,
            response: response?.answer,
          };
          postData(`${ChatStore}`, ChatStorepayload).catch(handleError);
        }
      })
      .catch(() => {
        postData(`${ChatURLAI}`, payload)
          .then((response) => handleResponse(response))
          .catch((error) => handleError(error));
      });
  };

  // const iconcolor: any = {
  //   light: "#003032",
  //   dark: "#FFFFFF",
  //   default: "#003032",
  // };

  // Handle search input change
  const handleSearchChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(e?.target?.value);
    setSearchQuerystarred(e?.target?.value);
  };

  // Filter chats based on search query, or show all if query is blank
  // const filteredChatsstarred = searchQuery
  //   ? statredchat?.filter((chat: { chat_title: string }) =>
  //     chat?.chat_title.toLowerCase().includes(searchQuery?.toLowerCase())
  //   )
  //   : statredchat;
  const filteredChatsstarred = searchQuery
    ? chatlist
        ?.filter((chat: { chat_title: string }) =>
          chat?.chat_title.toLowerCase().includes(searchQuery?.toLowerCase())
        )
        .sort((a: any, b: any) => b.flagged - a.flagged)
    : chatlist?.sort((a: any, b: any) => b.flagged - a.flagged);
  const filteredChats = searchQuerystarred
    ? chathistory?.filter((chat: { chat_title: string }) =>
        chat?.chat_title
          ?.toLowerCase()
          ?.includes(searchQuerystarred?.toLowerCase())
      )
    : chathistory;

  const extractTime = (chatDate: string) => {
    const date = chatDate ? new Date(chatDate + "z") : new Date();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const formattedDate = date.toDateString();
    const formattedTime = `${formattedDate}:${hours}:${minutes}`;
    return formattedTime;
  };

  const copyText = (index: number) => {
    // Get the text content of the div with the specific inline styles
    const textToCopy = (
      document.getElementById(`answer-${index}`) as HTMLDivElement
    )?.innerText;

    // Use the Clipboard API to copy the text
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        const updatedState = {
          ...isTextCopied,
          [`answer-${index}`]: true,
        };
        setIsTextCopied(updatedState);
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  };

  return (
    <>
      {/* <div className="chat_view">
        <div className="chat_section">
          <div className="row">
            <div className="left_panel col-md-3">
              <div className="left_panel_inner">
                <div className="chat">
                  <Box className="title" style={{ fontSize }}>
                    Chat History
                  </Box>
                  {Id === undefined ? (
                    <div className="search-bar" id="search-toggle">
                      <form
                        className="search-form d-flex align-items-center"
                        method="POST"
                        action="#"
                        onSubmit={(e) => e?.preventDefault()} // Prevent form submission
                      >
                        <input
                          className="search-input-text"
                          type="text"
                          name="query" //question add
                          placeholder="Search"
                          title="Enter search keyword"
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        <button type="submit" title="Search">
                          <i className="bi bi-search"></i>
                        </button>
                      </form>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="chat_inner">
                    <div
                      className="chathedding title"
                      onClick={toggleStarredChat}
                      style={{ cursor: "pointer" }}
                    >
                      Starred Chat{" "}
                      <span style={{ marginLeft: "10px" }}>
                        {isStarredChatOpen ? "▲" : "▼"}
                      </span>
                    </div>
                    {isStarredChatOpen &&
                      filteredChatsstarred?.length > 0 &&
                      filteredChatsstarred?.map(
                        (
                          chat: {
                            chat_title:
                              | string
                              | number
                              | boolean
                              | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | null
                              | undefined;
                            flagged: any;
                            id: number | undefined;
                          },
                          index: React.Key | null | undefined
                        ) => {
                          return (
                            <div className="chat_item" key={index}>
                              <div className="chat_item_inner row">
                                <div className="left_part col-sm-8 col-md-7 col-lg-8 col-xl-7">
                                  <div className="chat_detail">
                                    <div
                                      className="chat_title chat_head"
                                      onClick={() => displayChat(chat)}
                                    >
                                      {chat?.chat_title}
                                    </div>
                                  </div>
                                </div>
                                <div className="right_part col-sm-4 col-md-5 col-lg-4 col-xl-5">
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <div style={{ marginTop: "5px" }}>
                                      {" "}
                                      {chat?.flagged ? (
                                        <StarIcon
                                          sx={{ color: iconcolor[namecolor] }}
                                        />
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="dateandtime">
                                      <IconButton
                                        // onClick={()=>handleDelete(chat?.id)}
                                        onClick={() =>
                                          handleDeleteFiles(chat?.id)
                                        }
                                        sx={{
                                          width: "35px",
                                          height: "35px",
                                          color: iconcolor[namecolor],
                                        }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    <hr className="hr_chat"/>
                    <div
                      className="chathedding title"
                      onClick={toggleChatHistory}
                      style={{ cursor: "pointer" }}
                    >
                      {Id !== undefined ? "Chat" : "Chat History"}{" "}
                      <span style={{ marginLeft: "10px" }}>
                        {isChatHistoryOpen ? "▲" : "▼"}
                      </span>
                    </div>                 
                    {isChatHistoryOpen &&
                      filteredChats?.length > 0 &&
                      filteredChats.map(
                        (
                          chat: {
                            chat_title:
                              | string
                              | number
                              | boolean
                              | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | null
                              | undefined;
                            flagged: any;
                            id: number | undefined;
                          },
                          index: React.Key | null | undefined
                        ) => {
                          return (
                            <div className="chat_item" key={index}>
                              <div className="chat_item_inner row">
                                <div className="left_part col-sm-8 col-md-7 col-lg-8 col-xl-7">
                                  <div className="chat_detail">
                                    <div
                                      className="chat_title chat_head"
                                      onClick={() => displayChat(chat)}
                                    >
                                      {chat?.chat_title}
                                    </div>                                 
                                  </div>
                                </div>
                                <div className="right_part col-sm-4 col-md-5 col-lg-4 col-xl-5">
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                    }}
                                  >
                                    <div style={{ marginTop: "5px" }}>
                                      {" "}
                                      {chat?.flagged ? (
                                        <StarIcon
                                          color={iconcolor[namecolor]}
                                        />
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="dateandtime">
                                      <IconButton
                                        // onClick={()=>handleDelete(chat?.id)}
                                        onClick={() =>
                                          handleDeleteFiles(chat?.id)
                                        }
                                        sx={{
                                          width: "35px",
                                          height: "35px",
                                          color: iconcolor[namecolor],
                                        }}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className="right_panel col-md-9">
              <div className="right_panel_inner">
                <div className="message">
                  <div className="message_inner ">
                    <div className="profile_top">
                      <div className="left_part">
                        <div className="chat_detail">
                          <div className="chat_title">
                            <div className="title" style={{ fontSize: "27px" }}>
                              {Id !== undefined ? "Chat" : ""}
                            </div>
                          </div>
                        </div>
                      </div>
                      {Id !== undefined ? (
                        <div className="right_part">
                          {selectedchat && selectedchat?.length > 0 && (
                            <div className="dropdown_content">
                              {chatsaved ? (
                                <span onClick={() => saveChatstar()}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="green"
                                    className="bi bi-flag-fill"
                                    viewBox="0 0 16 16"
                                    cursor="pointer"
                                  >
                                    <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
                                  </svg>
                                </span>
                              ) : (
                                <span onClick={() => saveChatstar()}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-flag-fill"
                                    viewBox="0 0 16 16"
                                    cursor="pointer"
                                  >
                                    <title>Save Chat</title>
                                    <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12 12 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A20 20 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a20 20 0 0 0 1.349-.476l.019-.007.004-.002h.001" />
                                  </svg>
                                </span>
                              )}
                            </div>
                          )}
                          <div>
                            <button
                              className="btn btn-primary chatbutton"
                              onClick={() => newchat()}
                            >
                              New Chat
                            </button>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="profile_bottom">
                      <div className="chat">
                        {selectedchat?.map((chat: any, index: any) => (
                          <div key={index} className="chat_wrapper">
                            {chat?.question && (
                              <div className="chat_message">
                                <div
                                  className="msg_txt BG_chat"
                                  style={{ fontSize: "15px" }}
                                >
                                  {chat?.question}
                                </div>
                              </div>
                            )}

                            {chat?.answer && (
                              <div className="chat_message chat_message-own">
                                <div
                                  className="msg_txt BG_chatA"
                                  //   style={{ maxWidth: "80%", fontSize: "18px" }}
                                >
                                  <Chatbot answer={chat?.answer} />
                                  {chat?.speak}
                                </div>
                                {chat?.speak === true ? (
                                  <div className="date_time">
                                    <img
                                      src={soundimg}
                                      alt="sound-img"
                                      height="50px"
                                      width="50px"
                                      className="soundimg"
                                    />
                                    <svg
                                      fill={iconcolor[namecolor]}
                                      version="1.1"
                                      id="Capa_1"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20px"
                                      height="20px"
                                      viewBox="0 0 306.257 306.257"
                                      cursor="pointer"
                                      onClick={() => stop(index)}
                                    >
                                      <title>Stop</title>
                                      <g
                                        id="SVGRepo_bgCarrier"
                                        stroke-width="0"
                                      ></g>
                                      <g
                                        id="SVGRepo_tracerCarrier"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      ></g>
                                      <g id="SVGRepo_iconCarrier">
                                        <g>
                                          <path d="M19.747,121.968v70.068c0,21.499,17.43,38.924,38.924,38.924h40.703l112.088,73.612 c11.351,6.271,26.808-5.883,34.372-21.256L47.261,84.75C31.333,89.628,19.747,104.438,19.747,121.968z"></path>
                                          <path d="M250.386,41.816c0-21.5-19.464-51.253-38.924-38.924L108.71,76.499l141.676,141.677V41.816z"></path>
                                          <path d="M55.463,83.202l193.146,193.145l18.88,18.874c3.459,3.469,8.005,5.204,12.547,5.204c4.541,0,9.087-1.735,12.552-5.204 c6.934-6.929,6.934-18.17,0-25.104l-42.197-42.197L103.037,80.566L38.771,16.314c-3.461-3.469-8.005-5.204-12.549-5.204 c-4.544,0-9.085,1.735-12.552,5.204c-6.937,6.928-6.937,18.17,0,25.101L55.463,83.202z"></path>
                                        </g>
                                      </g>
                                    </svg>
                                  </div>
                                ) : (
                                  <div
                                    className="date_time"
                                    onClick={() =>
                                      speak(chat && chat?.answer, index)
                                    }
                                  >
                                    <svg
                                      fill={iconcolor[namecolor]}
                                      width="20px"
                                      height="20px"
                                      viewBox="0 -32 576 576"
                                      xmlns="http://www.w3.org/2000/svg"
                                      cursor="pointer"
                                    >
                                      <title>Play</title>
                                      <g
                                        id="SVGRepo_bgCarrier"
                                        stroke-width="0"
                                      ></g>
                                      <g
                                        id="SVGRepo_tracerCarrier"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      ></g>
                                      <g id="SVGRepo_iconCarrier">
                                        <path d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z"></path>
                                      </g>
                                    </svg>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="searchbar_wrap">
                <div className="search_bar">
                  {Id !== undefined ? (
                    <div className="input-group">
                      <input
                        type="text"
                        ref={chatRef}
                        className="form-control"
                        placeholder="Search..."
                        aria-label="Search"
                        value={search}
                        onChange={(e) => setSearch(e?.target?.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <button
                        className="btn search_btn"
                        type="button"
                        onClick={() => searchData()}
                        style={{ top: "15%" }}
                      >                      
                        <SendIcon className="mainsearch" />
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                  {searcherr === true ? (
                    <small className="text-danger">
                      Please Enter your query!!
                    </small>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <main className="main-wrapper">
        <div className="main-content">
          <div
            className={`chat-panel ${!(filteredChats?.length > 0) ? "" : ""}`}
          >
            {Id ? (
              <div
                className={`left-side-history ${
                  showHistory ? "showhistory" : ""
                }`}
              >
                <div className="d-lg-none mb-4 ms-auto d-flex">
                  <button className="btn btn-outline-secondary ms-auto btn-sm d-flex align-items-center justify-content-center">
                    <CloseOutlinedIcon onClick={() => setShowHistory(false)} />
                  </button>
                </div>
                <div className="search-filter">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    name="query" //question add
                    title="Enter search keyword"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button className="btn btn-primary">
                    <img src={searchWhite} alt="" />
                  </button>
                </div>
                <div className="history-label">Today&apos;s Search</div>
                <PerfectScrollbar className="history-list">
                  <>
                    {filteredChats?.length > 0 &&
                      filteredChats?.map(
                        (
                          chat: {
                            chat_title:
                              | string
                              | number
                              | boolean
                              | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | null
                              | undefined;
                            flagged: any;
                            id: number | undefined;
                            created_at: string;
                          },
                          index: React.Key | null | undefined
                        ) => (
                          <li
                            onClick={() => displayChat(chat)}
                            key={`recent_chat_${index}`}
                          >
                            <div className="d-flex flex-column " role="button">
                              <div className="date">
                                {extractTime(chat?.created_at)}
                              </div>
                              <div className="question">{chat?.chat_title}</div>
                            </div>
                            <ul className="action-button">
                              <li
                                role="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFiles(chat?.id);
                                }}
                              >
                                <DeleteOutlineOutlinedIcon
                                  sx={{ fontSize: "18px" }}
                                />
                              </li>
                            </ul>
                          </li>
                        )
                      )}
                  </>
                </PerfectScrollbar>
              </div>
            ) : (
              <div
                className={`left-side-history ${
                  showHistory ? "showhistory" : ""
                }`}
              >
                <div className="d-lg-none mb-4 ms-auto d-flex">
                  <button className="btn btn-outline-secondary ms-auto btn-sm d-flex align-items-center justify-content-center">
                    <CloseOutlinedIcon onClick={() => setShowHistory(false)} />
                  </button>
                </div>
                <div className="search-filter">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    name="query" //question add
                    title="Enter search keyword"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button className="btn btn-primary">
                    <img src={searchWhite} alt="" />
                  </button>
                </div>

                <div className="history-label">Chat History</div>
                <PerfectScrollbar className="history-list">
                  <>
                    {filteredChatsstarred?.length > 0 &&
                      filteredChatsstarred?.map(
                        (
                          chat: {
                            chat_title:
                              | string
                              | number
                              | boolean
                              | React.ReactElement<
                                  any,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | React.ReactPortal
                              | null
                              | undefined;
                            flagged: any;
                            id: number | undefined;
                            created_at: string;
                          },
                          index: React.Key | null | undefined
                        ) => (
                          <li
                            onClick={() => displayChat(chat)}
                            key={`chat_${index}`}
                          >
                            <div className="d-flex flex-column " role="button">
                              <div className="date">
                                {extractTime(chat?.created_at)}
                              </div>
                              <div className="question">{chat?.chat_title}</div>
                            </div>
                            <ul className="action-button">
                              <li role="button">
                                <DeleteOutlineOutlinedIcon
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFiles(chat?.id);
                                  }}
                                  sx={{ fontSize: "18px" }}
                                />
                              </li>
                              {chat?.flagged && (
                                <li
                                  className={`${chat?.flagged ? "active" : ""}`}
                                  role="button"
                                >
                                  <BookmarkIcon
                                    sx={{ fontSize: "18px", color: "#9943ec" }}
                                  />
                                </li>
                              )}
                            </ul>
                          </li>
                        )
                      )}
                  </>
                </PerfectScrollbar>
              </div>
            )}
            <div className="main-chat-panel">
              <div className="mobile-chat-header d-lg-none">
                <ul>
                  <li>
                    <SyncAltOutlinedIcon
                      onClick={() => setShowHistory(!showHistory)}
                    />
                  </li>
                </ul>
              </div>
              <div className="inner-panel">
                {Id !== undefined ? (
                  <div className="chat-header2">
                    {!showInitialPage && (
                      <button
                        className="btn btn-primary btn-sm d-flex align-items-center gap-1 rounded-pill"
                        onClick={newchat}
                      >
                        <AddOutlinedIcon /> New Chat
                      </button>
                    )}
                    {!showInitialPage ? (
                      chatsaved ? (
                        <FlagIcon style={{ color: "#9943ec" }} />
                      ) : (
                        <FlagOutlinedIcon
                          style={{ cursor: "pointer" }}
                          onClick={saveChatstar}
                        />
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                {/* <div className="chat-result"> */}
                <div className="chat-result">
                  {loading && (
                    <FullScreenLoader msg={loaderMsg} flag={"chat"} />
                  )}
                  {selectedchat?.length && selectedchat?.length > 0 ? (
                    <ul>
                      {selectedchat?.map((chat: any, index: any) => (
                        <>
                          {chat?.question && (
                            <li
                              key={`question_${index}`}
                              className="right-chat"
                            >
                              <div className="chat-card">
                                <div className="chat-card-header">
                                  <span className="anstext">
                                    <SearchOutlinedIcon
                                      sx={{ fontSize: "14px" }}
                                    />{" "}
                                    Question
                                  </span>
                                </div>
                                <div className="chat-card-body">
                                  <p>{chat?.question}</p>
                                </div>
                              </div>
                              <div className="profile-icon">
                                <img src={primaryLogo} alt="" />
                              </div>
                            </li>
                          )}
                          {chat?.answer && (
                            <li key={`answer_${index}`} className="left-chat">
                              <div className="profile-icon">
                                <img src={primaryLogo} alt="" />
                              </div>
                              <div className="chat-card">
                                <div className="chat-card-header">
                                  <span className="anstext">
                                    <DescriptionOutlinedIcon
                                      sx={{ fontSize: "14px" }}
                                    />{" "}
                                    Answer
                                  </span>
                                </div>
                                <div className="chat-card-body">
                                  <p>
                                    <Chatbot
                                      key={chat?.question}
                                      answer={chat?.answer}
                                      index={index}
                                    />
                                  </p>
                                </div>
                                <ul className="ansfooter">
                                  <ThumbUpAltOutlinedIcon
                                    onClick={() => handleUpIconClick(index)}
                                    sx={{
                                      fontSize: "14px",
                                      color:
                                        likedStates[index] === "liked" ||
                                        chat.like_dislike === true
                                          ? theme.palette.primary.main
                                          : chat.like_dislike !== null
                                          ? "#ccc"
                                          : "",
                                      cursor:
                                        chat.like_dislike !== null
                                          ? "default"
                                          : "pointer",
                                      transform:
                                        likedStates[index] === "liked" ||
                                        chat.like_dislike === true
                                          ? "scale(1.3)"
                                          : "scale(1)",
                                      transition: "color 0.3s ease",
                                      opacity:
                                        chat.like_dislike !== null &&
                                        chat.like_dislike !== true
                                          ? 0.5
                                          : 1,
                                    }}
                                  />
                                  <ThumbDownOutlinedIcon
                                    onClick={() => handleDownIconClick(index)}
                                    sx={{
                                      fontSize: "14px",
                                      color:
                                        likedStates[index] === "disliked" ||
                                        chat.like_dislike === false
                                          ? theme.palette.primary.main
                                          : chat.like_dislike !== null
                                          ? "#ccc"
                                          : "",
                                      cursor:
                                        chat.like_dislike !== null
                                          ? "default"
                                          : "pointer",
                                      transform:
                                        likedStates[index] === "disliked" ||
                                        chat.like_dislike === false
                                          ? "scale(1.3)"
                                          : "scale(1)",
                                      transition: "color 0.3s ease",
                                      opacity:
                                        chat.like_dislike !== null &&
                                        chat.like_dislike !== false
                                          ? 0.5
                                          : 1,
                                    }}
                                  />
                                  <li onClick={() => copyText(index)}>
                                    <ContentCopyOutlinedIcon
                                      sx={{ fontSize: "14px" }}
                                    />
                                    <span>
                                      {isTextCopied[`answer-${index}`]
                                        ? "Copied"
                                        : "Copy"}
                                    </span>
                                  </li>
                                  {!chat?.speak ? (
                                    <li
                                      onClick={() =>
                                        speak(chat && chat?.answer, index)
                                      }
                                    >
                                      <VolumeUpOutlinedIcon
                                        sx={{ fontSize: "14px" }}
                                      />{" "}
                                      <span>Read</span>
                                    </li>
                                  ) : (
                                    <li onClick={() => stop(index)}>
                                      <VolumeOffOutlinedIcon
                                        sx={{ fontSize: "14px" }}
                                      />{" "}
                                      <span>Stop</span>
                                    </li>
                                  )}
                                  <li
                                    onClick={() =>
                                      regenerateChat(chat?.question)
                                    }
                                  >
                                    <CachedOutlinedIcon
                                      sx={{ fontSize: "14px" }}
                                    />{" "}
                                    <span>Regenerate</span>
                                  </li>
                                </ul>
                              </div>
                            </li>
                          )}
                        </>
                      ))}
                    </ul>
                  ) : loading ? (
                    <FullScreenLoader msg={loaderMsg} flag={"chat"} />
                  ) : (
                    <div className="welcome-box">
                      <img src={chatLogo} alt="" />
                      <h3>{`${
                        Id
                          ? "Hi, How can I help you today?"
                          : "Please select conversation"
                      }`}</h3>
                    </div>
                  )}
                </div>
                {/* </div> */}
                {/* <div className="chat-suggestion">
                  <h4>Suggestions</h4>
                  <ul className="slider">
                    <li><i className="material-icons-outlined">chat</i> Start my history exam</li>
                    <li><i className="material-icons-outlined">chat</i> What's the news today</li>
                    <li><i className="material-icons-outlined">chat</i> Test myself</li>
                  </ul>
                  <div className="dots"></div>
                </div> */}
                {Id !== undefined ? (
                  <>
                    <div className="chat-input">
                      {/* <input type="text" className="form-control" placeholder="Type your question" /> */}
                      <input
                        type="text"
                        ref={chatRef}
                        className="form-control custom-input"
                        placeholder="Type your question"
                        aria-label="Search"
                        value={search}
                        onChange={(e) => setSearch(e?.target?.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <button
                        type="button"
                        onClick={searchData}
                        className="btn btn-primary p-0 overlap-button"
                      >
                        <ArrowUpwardOutlinedIcon />
                      </button>
                    </div>
                    {searcherr === true && (
                      <small className="text-danger">
                        Please Enter your query!!
                      </small>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {/* <div className="change-instructor">
                  <select name="" className="form-select" id="">
                    <option value="">Change Instructor</option>
                  </select>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>
      <DeleteDialog
        isOpen={dataDelete}
        onCancel={handlecancel}
        onDeleteClick={() => handleDelete(dataDeleteId)}
        title="Delete chat ?"
      />
    </>
  );
};

export default Chat;
