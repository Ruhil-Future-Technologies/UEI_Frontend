import React, { useEffect, useRef, useState } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import '../../Chat/Chat.scss';
import { toast, ToastContentProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@mui/icons-material/VolumeOffOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import FlagIcon from '@mui/icons-material/Flag';
import searchWhite from '../../../assets/icons/search-white.svg';
import primaryLogo from '../../../assets/icons/logo-primary.png';
import chatLogo from '../../../assets/img/chat-logo.svg';
import '../../../assets/css/newstyle.scss';
import '../../../assets/css/main.scss';
import { useTheme } from '@mui/material/styles';
import { ImageModal } from '../../../Components/ImageModal';
import { ChatTable } from '../../Chat/Tablechat';
import useTextToSpeech from '../../Chat/speech';
import FullScreenLoader from '../../Loader/FullScreenLoader';
import { QUERY_KEYS, QUERY_KEYS_TEACHER} from '../../../utils/const';
import useApi from '../../../hooks/useAPI';
import Chatbot from '../../Chatbot';
import { DeleteDialog } from '../../../Components/Dailog/DeleteDialog';



const TeacherChat = () => {
  const { textToSpeech, stopSpeech } = useTextToSpeech();
  const userid = localStorage.getItem('user_uuid') || '';
  const teacherid = localStorage.getItem('teacher_id') || '';
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [studentDetail, setStudentData] = useState<any>();
  const [teacherDetail, setTeacherDetails] = useState<any>();
  const [searcherr, setSearchErr] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { Id } = useParams();

  const expandedChat = localStorage.getItem('expandedChatData')
    ? JSON.parse(localStorage.getItem('expandedChatData')!)
    : [];

  const [expandedChatData] = useState<any>(() => {
    const chats =
      typeof expandedChat.chats === 'string'
        ? JSON.parse(expandedChat.chats)
        : expandedChat.chats;
    return chats || [];
  });

  const [hasInitialExpandedChat, setHasInitialExpandedChat] = useState(false);
  const [selectedchat, setSelectedChat] = useState<any>(expandedChatData);
  const [expandSearch, setExpandSearch] = useState(false);
  const [likedStates, setLikedStates] = useState<{ [key: string]: string }>({});

  const [dataDelete, setDataDelete] = useState(false);
  const [dataflagged, setDataflagged] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState<number>();
  const ChatURL = QUERY_KEYS.CHATADD;
  const ChatRAGURL = QUERY_KEYS.CHATRAGMODEL;
  
  const ChatOLLAMAURL = QUERY_KEYS.CHATOLLAMA;
  const ChatURLAI = QUERY_KEYS.CHATADDAI;
  const ChatStore = QUERY_KEYS.CHAT_STORE;
  const ChatDELETEURL = QUERY_KEYS.CHATDELETE;
  const chatlisturl = QUERY_KEYS.CHAT_LIST_T;
  const chataddconversationurl = QUERY_KEYS.CHAT_HISTORYCON;
  // const university_list = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITY;
  // const StudentGETURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
  const TEACHERURL = QUERY_KEYS_TEACHER.GET_TECHER_BY_UUID;
  const [chat, setchatData] = useState<any>([]);
  const [chatlist, setchatlistData] = useState<any>();
  const [chathistory, setchathistory] = useState<any>([]);
  const [chathistoryrecent, setchathistoryrecent] = useState<any>();
  const [chatsaved, setChatSaved] = useState<boolean>(false);
  const [displayedChat, setDisplayedChat] = useState<any>([]);
  const { postDataJson, getData, deleteData } = useApi();
  const navigate = useNavigate();
  const profileCompletion =  '100';
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQuerystarred, setSearchQuerystarred] = useState('');
  const [showInitialPage, setShowInitialPage] = useState(true);
  const [loaderMsg, setLoaderMsg] = useState('');
  const [isTextCopied, setIsTextCopied] = useState<any>({});
  const synth: SpeechSynthesis = window?.speechSynthesis;
  const theme = useTheme();
  const [imageOpen, setImageOpen] = useState(false);
  const [image, setImage] = useState('');

  if (profileCompletion !== '100') {
    navigate('/main/DashBoard');
  }
  const chatRef = useRef<HTMLInputElement>(null);
  const handlecancel = () => {
    setDataDelete(false);
  };

  useEffect(() => {
    if (expandedChat.loading) {
      setLoading(true);
      setLoaderMsg(expandedChat.loaderMessage);

      setStudentData(expandedChat.studentData);
      setSearch(expandedChat.pendingQuestion);
      setExpandSearch(true);
      localStorage.setItem('chatData', JSON.stringify(expandedChatData));
      setchatData(expandedChatData);
    } else {
      setSelectedChat(expandedChatData);
      if (expandedChatData.length > 0 && !hasInitialExpandedChat) {
        setHasInitialExpandedChat(true);
        localStorage.setItem('chatData', JSON.stringify(expandedChatData));
        setchatData(expandedChatData);
      }
    }
  }, []);

  useEffect(() => {
    if (!expandedChat.loading) {
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
    if (expandedChatData.length > 0 && !hasInitialExpandedChat) {
      setHasInitialExpandedChat(true);
    }
  }, [expandedChatData]);

  useEffect(() => {
    if (!expandedChatData.length) {
      setSelectedChat([]);
    }
    setTimeout(() => {
      if (Id !== undefined) {
        setShowInitialPage(true);
        if (!expandedChatData.length) {
          setSelectedChat([]);
        }

        setSearchQuery('');
        setSearchQuerystarred('');
      } else {
        setShowInitialPage(false);
        if (!expandedChatData.length) {
          setSelectedChat([]);
        }
        setSearchQuery('');
        setSearchQuerystarred('');
      }
    }, 500);
  }, [Id]);

  const handleMediaClick = (event: MouseEvent) => {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    const svgElement = target.closest('svg');

    if (svgElement) {
      const content = svgElement.outerHTML;
      setImage(content);
      setImageOpen(true);
    }
  };

  useEffect(() => {
    const containers = document.querySelectorAll('.diagram-container');

    containers.forEach((container) => {
      const mediaElements = container.querySelectorAll('svg, img');
      mediaElements.forEach((element: any) => {
        element.style.cursor = 'pointer';
        element.addEventListener('click', handleMediaClick);
      });
    });

    return () => {
      const containers = document.querySelectorAll('.diagram-container');
      containers.forEach((container) => {
        const mediaElements = container.querySelectorAll('svg, img');
        mediaElements.forEach((element: any) => {
          element.removeEventListener('click', handleMediaClick);
        });
      });
    };
  }, [chat]);

  const handleUpIconClick = (index: number) => {
    if (selectedchat[index].like_dislike !== null) {
      return;
    }
    setLikedStates((prevStates) => ({
      ...prevStates,
      [index]: 'liked',
    }));

    const updatedChat = [...selectedchat];
    updatedChat[index] = {
      ...updatedChat[index],
      like_dislike: true,
    };
    setSelectedChat(updatedChat);
    setchatData((prevChatData: any) => {
      return prevChatData.map((item: any) => {
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
    });

    const chatDataString = localStorage.getItem('chatData');
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

      localStorage.setItem('chatData', JSON.stringify(updatedChatData));
      setDisplayedChat(updatedChatData);
    }
  };

  const handleDownIconClick = (index: number) => {
    if (selectedchat[index].like_dislike !== null) {
      return;
    }
    setLikedStates((prevStates) => ({
      ...prevStates,
      [index]: 'disliked',
    }));
    const updatedChat = [...selectedchat];
    updatedChat[index] = {
      ...updatedChat[index],
      like_dislike: false,
    };
    setSelectedChat(updatedChat);

    setchatData((prevChatData: any) => {
      return prevChatData.map((item: any) => {
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
    });

    const chatDataString = localStorage.getItem('chatData');
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
      localStorage.setItem('chatData', JSON.stringify(updatedChatData));
      setDisplayedChat(updatedChatData);
    }
  };

  const callAPI = async () => {
    getData(`${TEACHERURL}/${userid}`).then((data) => {
      setTeacherDetails(data?.data);
    })
    .catch((e) => {
      toast.error(e?.message, {
        hideProgressBar: true,
        theme: 'colored',
      });
    });
    getData(`${chatlisturl}/${teacherid}`)
      .then((data: any) => {
        setchatlistData(data?.data);
        setchathistory(data?.data);
        setchathistoryrecent(data?.data);
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  useEffect(() => {
    callAPI();
  }, []);

  function getTodaysData(arr: any) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

    return arr?.filter((item: any) => {
      if (item?.created_at && typeof item.created_at === 'string') {
        const itemDate = item.created_at.split(' ')[0]; // Extract 'YYYY-MM-DD' from 'created_at'
        return itemDate === today;
      }
      return false;
    });
  }

  const filterdataCall = async () => {
    if (Id === 'recentChat') {
      const parsedChatHistory = await chathistory?.map(
        (chat: { updated_at: string | number | Date }) => ({
          ...chat,
          updated_at: new Date(chat?.updated_at),
        }),
      );
      // Sort the chat history by updated_at in descending order
      const sortedChatHistory = parsedChatHistory?.sort(
        (a: { updated_at: any }, b: { updated_at: any }) =>
          b?.updated_at - a?.updated_at,
      );
      const chatDataString: any = localStorage?.getItem('chatData');
      const chatmodify = JSON.parse(chatDataString);

      if (chatmodify && chatmodify[0] && chatmodify[0].question !== '') {
        const todaysChat = getTodaysData(sortedChatHistory);
        const newArray = [...todaysChat];
        const column = [
          {
            question: chatmodify[0]?.question,
            answer: chatmodify[0]?.answer,
            diagram_code: chatmodify[0]?.diagram_code,
            table_code: chatmodify[0]?.table_code,
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
    if (Id === 'recentChat') {
      filterdataCall();
    } else {
      setShowInitialPage(false);
      setchathistory(chathistoryrecent);
    }
  }, [Id, chatlist]);

  const speak = (text: string, index: number) => {
    stopSpeech(index);
    const textArray = Array.isArray(text) ? text : [text]; 
    // Update `speak` state for all chats
    const updatedChats = selectedchat.map((chat: any, i: number) => ({
        ...chat,
        speak: i === index, // Only the current index is true
    }));

    setSelectedChat(updatedChats);
    textToSpeech(textArray.join(" "), index);
};
  const stop = async (index: number) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    stopSpeech(index);

    // Update `speak` state for all chats
    const updatedChats = selectedchat.map((chat: any, i: number) => ({
        ...chat,
        speak: i === index ? false : chat.speak, // Set only the current index to false
    }));

    setSelectedChat(updatedChats);
};

  const handleResponse = (data: { data: any }) => {
    const newData = data?.data ? data?.data : data;
    newData.speak = false;
    newData.like_dislike = null;
    setSelectedChat((prevState: any) => {
      const newState = [...prevState, newData];
      const newIndex = newState.length - 1;
      setLikedStates((prevStates) => ({
        ...prevStates,
        [newIndex]:
          newData.like_dislike === true
            ? 'liked'
            : newData.like_dislike === false
              ? 'disliked'
              : '',
      }));
      return newState;
    });
    setChatSaved(false);
    setchatData((prevState: any) => [...prevState, newData]);
    setLoading(false);
    setSearch('');
    setShowInitialPage(false);
    getData(`${chatlisturl}/${teacherid}`)
      .then((data: any) => {
        setchathistory(data?.data);
        setchatlistData(data?.data);
        setchathistoryrecent(data?.data);
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
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
      theme: 'colored',
    });
  };

  const searchData = () => {
    setSearch('');

    if (search === '') {
      setSearchErr(true);
      return;
    }

    setLoading(true);
    setLoaderMsg('Searching result from knowledge base');
    setSearchErr(false);
    const prompt = studentDetail?.prompt?.replace('**question**', 'answer');
    let payload = {};
    // let rag_payload = {};
    if (selectedchat?.question !== '') {
      payload = {
        teacher_id: teacherid,
        question: search,
        prompt: prompt,
        course:teacherDetail?.course_name || null, 
        stream: teacherDetail?.subject || null,
        chat_hostory: [
          { role: 'user', content: selectedchat?.question },
          {
            role: 'assistant',
            content: selectedchat?.answer,
          },
        ],
      };
    } else {
      payload = {
        teacher_id: teacherid,
        question: search,
        prompt: prompt,
        course:teacherDetail?.course_name || null,
        stream: teacherDetail?.subject || null,
      };
    }

    const handleResponsereg = (data: { data: any }) => {
      const newData = data;
      setSelectedChat((prevState: any) => [...prevState, newData]);
      setChatSaved(false);
      setchatData((prevState: any) => [...prevState, newData]);
      setLoading(false);
      setSearch('');
      getData(`${chatlisturl}/${teacherid}`)
        .then((data: any) => {
          setchatlistData(data?.data);
          setchathistory(data?.data);
          setchathistoryrecent(data?.data);
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    };

    postDataJson(`${ChatURL}`, payload)
      .then((data) => {
        if (data.status || data.code === 404) {
          setLoaderMsg('Searching result from Rag model');
          if (teacherDetail.entity_type === 'school') {
            postDataJson(`${ChatRAGURL}`, {
              user_query: search,
              student_id: userid,
              school_college_selection:
              teacherDetail.entity_type,
              board_selection:
                null,
              state_board_selection:
                null,
              stream_selection: null,
              class_selection: teacherDetail.class_name || null,
              university_selection:teacherDetail?.university_name || null,
              college_selection: null,
              course_selection: teacherDetail?.course || null,
              year: null,
              subject: teacherDetail.subject || null,
            })
              .then((response) => {
                if (response?.status || response?.code === 402) {
                  function formatAnswer(answer: any) {
                    if (Array.isArray(answer)) {
                      return answer;
                    }
                    if (typeof answer === 'object' && answer !== null) {
                      const entries = Object.entries(answer);
                      return [
                        entries
                          .map(([key, value]) => {
                            if (
                              typeof value === 'string' &&
                              value.includes('\\frac') &&
                              !value.includes('$')
                            ) {
                              const latexValue = `$${value}$`;
                              return `${key}) ${latexValue}\n`;
                            }
                            return `${key}) ${value}\n`;
                          })
                          .join(''),
                      ];
                    }
                    return [answer.toString()];
                  }
                  const formattedResponse = {
                    data: {
                      question: response.question,
                      answer: formatAnswer(response.answer),
                      diagram_code: response.diagram_code,
                      table_code: response.table_code,
                    },
                  };
                  const ChatStorepayload = {
                    teacher_id: teacherid,
                    chat_question: response.question,
                    response: formatAnswer(response.answer),
                  };
                  if (response?.code !== 402) {
                    postDataJson(`${ChatStore}`, ChatStorepayload).catch(
                      handleError,
                    );
                  }
                  handleResponse(formattedResponse);
                } else {
                  setLoaderMsg('Fetching Data from Ollama model.');

                  postDataJson(`${ChatOLLAMAURL}`, {
                    user_query: search,
                    student_id: userid,
                    class_or_course_selection: studentDetail.class.name,
                  })
                    .then((response) => {
                      if (response?.status) {
                        handleResponse(response);
                        const ChatStorepayload = {
                          teacher_id: teacherid,
                          chat_question: search,
                          response: response?.answer,
                        };
                        postDataJson(`${ChatStore}`, ChatStorepayload).catch(
                          handleError,
                        );
                      }
                    })
                    .catch(() => {
                      postDataJson(`${ChatURLAI}`, payload)
                        .then((response) => handleResponse(response))
                        .catch((error) => handleError(error));
                    });
                }
              })
              .catch(() =>
                postDataJson(`${ChatOLLAMAURL}`, {
                  user_query: search,
                   student_id: userid,
                  class_or_course_selection: studentDetail?.class.name,
                })
                  .then((response) => {
                    if (response?.status) {
                      handleResponse(response);
                      const ChatStorepayload = {
                        teacher_id: teacherid,
                        chat_question: search,
                        response: response?.answer,
                      };
                      postDataJson(`${ChatStore}`, ChatStorepayload).catch(
                        handleError,
                      );
                    }
                  })
                  .catch(() => {
                    postDataJson(`${ChatURLAI}`, payload)
                      .then((response) => handleResponse(response))
                      .catch((error) => handleError(error));
                  }),
              );
          } else {
            const queryParams = {
              user_query: search,
              student_id: userid,
              school_college_selection: teacherDetail.entity_type || null,
              board_selection:  null,
              state_board_selection:  null,
              stream_selection:  null,
              class_selection: teacherDetail?.class_id || null,
              university_selection: teacherDetail?.university_name || null,
              college_selection: teacherDetail?.institution_name || null,
              course_selection: teacherDetail?.course || null,
              year: null,
              subject:teacherDetail?.subject_name || null,
            };
            return postDataJson(`${ChatRAGURL}`, queryParams)
              .then((response) => {
                if (response?.status || response?.code === 402) {
                  function formatAnswer(answer: any) {
                    if (Array.isArray(answer)) {
                      return answer;
                    }
                    if (typeof answer === 'object' && answer !== null) {
                      const entries = Object.entries(answer);
                      return [
                        entries
                          .map(([key, value]) => {
                            if (
                              typeof value === 'string' &&
                              value.includes('\\frac') &&
                              !value.includes('$')
                            ) {
                              const latexValue = `$${value}$`;
                              return `${key}) ${latexValue}\n`;
                            }
                            return `${key}) ${value}\n`;
                          })
                          .join(''),
                      ];
                    }
                    return [answer.toString()];
                  }
                  const formattedResponse = {
                    data: {
                      question: response.question,
                      answer: formatAnswer(response.answer),
                      diagram_code: response.diagram_code,
                      table_code: response.table_code,
                    },
                  };
                  const ChatStorepayload = {
                    teacher_id: teacherid,
                    chat_question: response.question,
                    response: formatAnswer(response.answer),
                  };
                  if (response?.code !== 402) {
                    postDataJson(`${ChatStore}`, ChatStorepayload).catch(
                      handleError,
                    );
                  }
                  handleResponse(formattedResponse);
                } else {
                  setLoaderMsg('Fetching Data from Ollama model.');
                  postDataJson(`${ChatOLLAMAURL}`, {
                    user_query: search,
                     student_id: userid,
                    class_or_course_selection: teacherDetail?.course_name || null,
                  })
                    .then((response) => {
                      if (response?.status) {
                        handleResponse(response);
                        const ChatStorepayload = {
                          teacher_id: teacherid,
                          chat_question: search,
                          response: response?.answer,
                        };
                        postDataJson(`${ChatStore}`, ChatStorepayload).catch(
                          handleError,
                        );
                      }
                    })
                    .catch(() => {
                      postDataJson(`${ChatURLAI}`, payload)
                        .then((response) => handleResponse(response))
                        .catch((error) => handleError(error));
                    });
                }
              })
              .catch(() => {
                setLoaderMsg('Fetching Data from Ollama model.');
                postDataJson(`${ChatOLLAMAURL}`, {
                  user_query: search,
                   student_id: userid,
                  class_or_course_selection: teacherDetail?.course_name || null,
                })
                  .then((response) => {
                    if (response?.status) {
                      handleResponse(response);
                      const ChatStorepayload = {
                        teacher_id: teacherid,
                        chat_question: search,
                        response: response?.answer,
                      };
                      postDataJson(`${ChatStore}`, ChatStorepayload).catch(
                        handleError,
                      );
                    }
                  })
                  .catch(() => {
                    postDataJson(`${ChatURLAI}`, payload)
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
        if (data?.status) {
          const ChatStorepayload = {
            teacher_id: teacherid,
            chat_question: search,
            response: data?.answer,
          };

          postDataJson(`${ChatStore}`, ChatStorepayload)
            .then((data) => {
              if (data?.status) {
                // handleResponse(data);
              } else if (data) {
                // handleError(data);
              }
            })
            .catch(handleError);

          handleResponsereg(data);
        } else if (data?.code === 404) {
          setLoaderMsg('Fetching Data from Ollama model.');

          return postDataJson(`${ChatOLLAMAURL}`, {
            user_query: search,
            student_id: userid,
            class_or_course_selection:
            teacherDetail.entity_type === 'school'
                ? teacherDetail?.class.name || null
                : teacherDetail?.course_name || null,
          });
        } else if (data) {
          handleError(data);
        }
      })
      .then((data) => {
        if (data?.status) {
          // handleResponse(data);
          const ChatStorepayload = {
            teacher_id: teacherid,
            chat_question: search,
            response: data?.answer,
          };

          postDataJson(`${ChatStore}`, ChatStorepayload)
            .then((data) => {
              if (data?.status) {
                // handleResponse(data);
              } else if (data) {
                // handleError(data);
              }
            })
            .catch(handleError);
          handleResponsereg(data);
        } else if (data?.code === 404) {
          setLoaderMsg('Fetching data from Chat-GPT API.');
          return postDataJson(`${ChatURLAI}`, payload);
        } else if (data) {
          handleError(data);
        }
      })
      .then((data) => {
        if (data?.status) {
          handleResponse(data);
        } else if (data) {
          handleError(data);
        }
      })
      .catch(handleError);
  };

  useEffect(() => {
    if (dataflagged) {
      setSelectedChat([]);
    }
  }, [dataflagged]);

  useEffect(() => {
    if (chat?.length > 0) {
      const existingChatData = localStorage.getItem('chatData');
      const parsedExistingChat = existingChatData
        ? JSON.parse(existingChatData)
        : [];
      const latestChatItem = chat[chat.length - 1];
      const isAlreadyInExisting = parsedExistingChat.some(
        (item: any) =>
          item.question === latestChatItem.question &&
          JSON.stringify(item.answer) === JSON.stringify(latestChatItem.answer),
      );

      if (!isAlreadyInExisting) {
        const updatedChatData = [...parsedExistingChat, latestChatItem];

        localStorage.setItem('chatData', JSON.stringify(updatedChatData));
      }
    }
  }, [chat]);

  let chatData: any;

  useEffect(() => {
    const chatDataString = localStorage?.getItem('chatData');
    const chatData = chatDataString ? JSON.parse(chatDataString) : [];

    if (chatData?.length > 0) {
      if (!expandedChatData) {
        saveChatlocal();
      }
    }
  }, [chatData]);

  const saveChatlocal = async () => {
    const chatDataString = localStorage?.getItem('chatData');
    const chatflagged = localStorage?.getItem('chatsaved');
    const isChatFlagged = chatflagged === 'true';
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
          chatitem?.chat_title === chatData?.[0]?.question,
      );
    }

    let chat_payload;
    if (
      datatest?.length !== 0 &&
      Array.isArray(chatData) &&
      chatData.length >= 2
    ) {
      chat_payload = {
        teacher_id: teacherid,
        chat_title: chatData?.[0]?.question,
        chat_conversation: JSON.stringify(chatData),
        flagged: isChatFlagged,
      };
    } else {
      chat_payload = {
        teacher_id: teacherid,
        chat_title: chatData?.[0]?.question,
        chat_conversation: JSON.stringify(chatData),
        flagged: isChatFlagged,
      };
    }
    await postDataJson(`${chataddconversationurl}`, chat_payload)
      .then(() => {
        callAPI();
        localStorage.removeItem('chatData');
        localStorage.removeItem('chatsaved');
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
          chatitem?.chat_title === chat[0]?.question,
      );
    }

    let chat_payload;
    if (datatest?.length !== 0 && Array.isArray(chat) && chat.length >= 2) {
      // chat?.shift();
      chat_payload = {
        teacher_id: teacherid,
        chat_title: chat[0]?.question,
        chat_conversation: JSON.stringify(chat),
        flagged: chatsaved,
      };
    } else {
      chat_payload = {
        teacher_id: teacherid,
        chat_title: chat[0]?.question,
        chat_conversation: JSON.stringify(chat),
        flagged: chatsaved,
      };
    }
    await postDataJson(`${chataddconversationurl}`, chat_payload)
      .then(() => {
        setChatSaved(false);
        localStorage.removeItem('chatData');
        localStorage.removeItem('chatsaved');

        callAPI();
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === 'Enter') {
      searchData();
    }
  };

  const newchat = async () => {
    setShowInitialPage(true);
    if (chat.length > 0) {
      await saveChat();
    }
    setSelectedChat([]);
    setDataflagged(true);
    setTimeout(() => {
      setDataflagged(false);
    }, 100);
    setchatData([]);
    setChatSaved(false);
    setSearch('');
    setSearchErr(false);
    synth.cancel();
    if (chatRef?.current) {
      chatRef?.current.focus();
      chatRef?.current.scrollIntoView();
    }
  };

  const displayChat = async (chats: any) => {
    setChatSaved(chats?.flagged === true);
    const parsedChatConversation = JSON.parse(chats?.chat_conversation);

    if (
      selectedchat.length > 0 &&
      parsedChatConversation.length > 0 &&
      selectedchat[0].question === parsedChatConversation[0].question &&
      JSON.stringify(selectedchat[0].answer) ===
        JSON.stringify(parsedChatConversation[0].answer)
    ) {
      return;
    }
    const initialLikedStates: { [key: string]: string } = {};
    setShowInitialPage(false);

    const datatest = chatlist.filter(
      (chatitem: { chat_title: any }) =>
        chatitem.chat_title === chat[0]?.question,
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
        elements = [itemchat.answer.join(' ')];
      } else if (typeof itemchat?.answer === 'string') {
        try {
          elements = JSON.parse(itemchat?.answer);
        } catch {
          elements = itemchat?.answer;
        }
      } else {
        elements = itemchat?.answer;
      }

      chatdata.answer = elements;
      chatdata.diagram_code = itemchat?.diagram_code;
      chatdata.table_code = itemchat?.table_code;
      chatdata.speak = false;
      chatdata.like_dislike = null;
      chatdataset.push(chatdata);

      if (itemchat?.like_dislike === true) {
        initialLikedStates[index] = 'liked';
      } else if (itemchat?.like_dislike === false) {
        initialLikedStates[index] = 'disliked';
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
          localStorage.removeItem('expandedChatData');
          setSelectedChat([]);
        }
        toast.success(data?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
        localStorage.removeItem('chatData');

        callAPI();

        setDataDelete(false);
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

  const saveChatstar = () => {
    setChatSaved(!chatsaved);
    localStorage.setItem('chatsaved', JSON.stringify(!chatsaved));
    saveChatlocal();
  };

  const regenerateChat = (question: any) => {
    setLoading(true);
    setLoaderMsg('Fetching Data from Ollama model.');
    setSearchErr(false);

    const prompt = studentDetail?.prompt?.replace('**question**', 'answer');
    let payload = {};

    if (selectedchat?.question !== '') {
      payload = {
        question: question,
        prompt: prompt,
        course:teacherDetail?.course_name || null,
        stream: teacherDetail?.subject || null,
        chat_hostory: [
          { role: 'user', content: selectedchat?.question },
          {
            role: 'assistant',
            content: selectedchat?.answer,
          },
        ],
      };
    } else {
      payload = {
        question: question,
        prompt: prompt,
        course:teacherDetail?.course_name || '',
        stream: teacherDetail?.subject || '',
      };
    }
    postDataJson(`${ChatOLLAMAURL}`, {
      user_query: question,
      student_id: userid,
      class_or_course_selection:
      teacherDetail.entity_type === 'school'
          ? teacherDetail?.class_name || ''
          : teacherDetail?.course_name || '',
    })
      .then((response) => {
        if (response?.status) {
          handleResponse(response);
          const ChatStorepayload = {
            teacher_id: teacherid,
            chat_question: question,
            response: response?.answer,
          };
          postDataJson(`${ChatStore}`, ChatStorepayload).catch(handleError);
        }
      })
      .catch(() => {
        postDataJson(`${ChatURLAI}`, payload)
          .then((response) => handleResponse(response))
          .catch((error) => handleError(error));
      });
  };
  // Handle search input change
  const handleSearchChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(e?.target?.value);
    setSearchQuerystarred(e?.target?.value);
  };
  const filteredChatsstarred = searchQuery
    ? chatlist
        ?.map((chat: any) => ({
          ...chat,
          updated_at: new Date(chat.updated_at),
        }))
        ?.filter((chat: { chat_title: string }) =>
          chat?.chat_title.toLowerCase().includes(searchQuery?.toLowerCase()),
        )
        ?.sort((a: any, b: any) => {
          if (b.flagged !== a.flagged) {
            return b.flagged - a.flagged;
          }

          return b.updated_at - a.updated_at;
        })
    : chatlist
        ?.map((chat: any) => ({
          ...chat,
          updated_at: new Date(chat.updated_at),
        }))
        ?.sort((a: any, b: any) => {
          if (b.flagged !== a.flagged) {
            return b.flagged - a.flagged;
          }
          return b.updated_at - a.updated_at;
        });
  const filteredChats = searchQuerystarred
    ? chathistory?.filter((chat: { chat_title: string }) =>
        chat?.chat_title
          ?.toLowerCase()
          ?.includes(searchQuerystarred?.toLowerCase()),
      )
    : chathistory;

  const extractTime = (chatDate: string) => {
    const date = chatDate ? new Date(chatDate + 'z') : new Date();

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
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
        console.error('Error copying text: ', err);
      });
  };

  return (
    <>
      <main className="main-wrapper">
        <div className="main-content p-lg-0">
          <div
            className={`chat-panel ${!(filteredChats?.length > 0) ? '' : ''}`}
          >
            {Id ? (
              <div
                className={`left-side-history ${
                  showHistory ? 'showhistory' : ''
                }`}
              >
                <div className="d-lg-none mb-4 ms-auto d-flex align-items-center">
                 <h6 className='mb-0'>Search History</h6>   
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
                <div className="history-list">
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
                          index: React.Key | null | undefined,
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
                                  sx={{ fontSize: '18px' }}
                                />
                              </li>
                              {chat?.flagged && (
                                <li
                                  className={`${chat?.flagged ? 'active' : ''}`}
                                  role="button"
                                >
                                  <BookmarkIcon
                                    sx={{ fontSize: '18px', color: '#9943ec' }}
                                  />
                                </li>
                              )}
                            </ul>
                          </li>
                        ),
                      )}
                  </>
                </div>
              </div>
            ) : (
              <div
                className={`left-side-history ${
                  showHistory ? 'showhistory' : ''
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
                <div className="history-list">
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
                          index: React.Key | null | undefined,
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
                                  sx={{ fontSize: '18px' }}
                                />
                              </li>
                              {chat?.flagged && (
                                <li
                                  className={`${chat?.flagged ? 'active' : ''}`}
                                  role="button"
                                >
                                  <BookmarkIcon
                                    sx={{ fontSize: '18px', color: '#9943ec' }}
                                  />
                                </li>
                              )}
                            </ul>
                          </li>
                        ),
                      )}
                  </>
                </div>
              </div>
            )}
            <div className="main-chat-panel p-0 p-lg-3">
              <div className="inner-panel">
                {Id !== undefined ? (
                  <div className="chat-header2">
                    {!showInitialPage && (
                      <button
                        className="btn btn-primary  d-flex align-items-center gap-1"
                        onClick={newchat}
                      >
                        <AddOutlinedIcon /> New Chat
                      </button>
                    )}
                    {!showInitialPage ? (
                      chatsaved ? (
                        <FlagIcon style={{ color: '#9943ec' }} />
                      ) : (
                        <FlagOutlinedIcon
                          style={{ cursor: 'pointer' }}
                          onClick={saveChatstar}
                        />
                      )
                    ) : (
                      <></>
                    )}
                    <div className="me-auto d-lg-none">
                      <SyncAltOutlinedIcon
                        onClick={() => setShowHistory(!showHistory)}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="chat-result">
                  {loading && (
                    <FullScreenLoader msg={loaderMsg} flag={'chat'} />
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
                                      sx={{ fontSize: '14px' }}
                                    />{' '}
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
                                      sx={{ fontSize: '14px' }}
                                    />{' '}
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
                                  {chat?.diagram_code && (
                                    <>
                                      {' '}
                                      <div
                                        className="diagram-container"
                                        style={{
                                          width: '100%',
                                          height: '100%',
                                          overflow: 'hidden',
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                        }}
                                        key={index}
                                        dangerouslySetInnerHTML={{
                                          __html: chat?.diagram_code,
                                        }}
                                      />
                                      <ImageModal
                                        isOpen={imageOpen}
                                        onClose={() => setImageOpen(false)}
                                        content={image}
                                      />
                                    </>
                                  )}
                                  {chat?.table_code && (
                                    <ChatTable tableCode={chat?.table_code} />
                                  )}
                                </div>
                                <ul className="ansfooter">
                                  <ThumbUpAltOutlinedIcon
                                    onClick={() => handleUpIconClick(index)}
                                    sx={{
                                      fontSize: '14px',
                                      color:
                                        likedStates[index] === 'liked' ||
                                        chat.like_dislike === true
                                          ? theme.palette.primary.main
                                          : chat.like_dislike !== null
                                            ? '#ccc'
                                            : '',
                                      cursor:
                                        chat.like_dislike !== null
                                          ? 'default'
                                          : 'pointer',
                                      transform:
                                        likedStates[index] === 'liked' ||
                                        chat.like_dislike === true
                                          ? 'scale(1.3)'
                                          : 'scale(1)',
                                      transition: 'color 0.3s ease',
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
                                      fontSize: '14px',
                                      color:
                                        likedStates[index] === 'disliked' ||
                                        chat.like_dislike === false
                                          ? theme.palette.primary.main
                                          : chat.like_dislike !== null
                                            ? '#ccc'
                                            : '',
                                      cursor:
                                        chat.like_dislike !== null
                                          ? 'default'
                                          : 'pointer',
                                      transform:
                                        likedStates[index] === 'disliked' ||
                                        chat.like_dislike === false
                                          ? 'scale(1.3)'
                                          : 'scale(1)',
                                      transition: 'color 0.3s ease',
                                      opacity:
                                        chat.like_dislike !== null &&
                                        chat.like_dislike !== false
                                          ? 0.5
                                          : 1,
                                    }}
                                  />
                                  <li onClick={() => copyText(index)}>
                                    <ContentCopyOutlinedIcon
                                      sx={{ fontSize: '14px' }}
                                    />
                                    <span>
                                      {isTextCopied[`answer-${index}`]
                                        ? 'Copied'
                                        : 'Copy'}
                                    </span>
                                  </li>
                                    <li key={index} onClick={() => (chat?.speak ? stop(index) : speak(chat?.answer, index))}>
                                      {chat?.speak ? (
                                        <>
                                          <VolumeOffOutlinedIcon sx={{ fontSize: '14px' }} /> <span>Stop</span>
                                        </>
                                      ) : (
                                        <>
                                          <VolumeUpOutlinedIcon sx={{ fontSize: '14px' }} /> <span>Read</span>
                                        </>
                                      )}
                                    </li>
                                  

                                  <li
                                    onClick={() =>
                                      regenerateChat(chat?.question)
                                    }
                                  >
                                    <CachedOutlinedIcon
                                      sx={{ fontSize: '14px' }}
                                    />{' '}
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
                    <FullScreenLoader msg={loaderMsg} flag={'chat'} />
                  ) : (
                    <div className="welcome-box">
                      <img src={chatLogo} alt="" />
                      <h3>{`${
                        Id
                          ? 'Hi, How can I help you today?'
                          : 'Please select conversation'
                      }`}</h3>
                    </div>
                  )}
                </div>
                {Id !== undefined ? (
                  <>
                    <div className="chat-input">
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
                        className="btn btn-light p-0 overlap-button"
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
              </div>
            </div>
          </div>
        </div>
      </main>
      <DeleteDialog
        isOpen={dataDelete}
        onCancel={handlecancel}
        onDeleteClick={() => handleDelete(dataDeleteId)}
        title="chat"
      />
    </>
  );
};

export default TeacherChat;
