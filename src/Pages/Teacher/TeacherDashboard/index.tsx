/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import profile from '../../../assets/img/profile.png';
import { useNavigate } from 'react-router-dom';
import toperstudent from '../../../assets/img/topper-image.png';
import robotimg from '../../../assets/img/robot.png';
import glogowhite from '../../../assets/img/g-logo-white.svg';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PercentIcon from '@mui/icons-material/Percent';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import StreamIcon from '@mui/icons-material/Stream';
import AttractionsIcon from '@mui/icons-material/Attractions';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import useApi from '../../../hooks/useAPI';
import {
  QUERY_KEYS,
  QUERY_KEYS_CLASS,
  QUERY_KEYS_COURSE,
  QUERY_KEYS_TEACHER,
} from '../../../utils/const';
import { CourseRep0oDTO, IClass } from '../../../Components/Table/columns';
import { toast, ToastContentProps } from 'react-toastify';
import TeacherDashboardCharts from '../TeacherChart';
import SessionTracker from '../../../Components/Tracker';
import TeacherGraph from '../TeacherGraphs';
import ChatComponent from '../../../Components/Chat/ChatComponent';
import useTextToSpeech from '../../Chat/speech';

const TeacherDash = () => {
  const teacherId = localStorage.getItem('user_uuid');
  const userId = localStorage.getItem('teacher_id');
  const { textToSpeech, stopSpeech } = useTextToSpeech();
  const ClassURL = QUERY_KEYS_CLASS.GET_CLASS;
  const CourseURL = QUERY_KEYS_COURSE.GET_COURSE;
  const chatlisturl = QUERY_KEYS.CHAT_LIST_T;
  const ChatRAGURL = QUERY_KEYS.CHATRAGMODEL;
  const ChatOLLAMAURL = QUERY_KEYS.CHATOLLAMA;
  const ChatURLAI = QUERY_KEYS.CHATADDAI;
  const ChatStore = QUERY_KEYS.CHAT_STORE;
  const chataddconversationurl = QUERY_KEYS.CHAT_HISTORYCON;
  const editTeacher = QUERY_KEYS_TEACHER.TEACHER_EDIT;
  const { getData, postDataJson } = useApi();

  const [teacherData, setTeacherData] = useState<any>();
  const [selectedEntity, setSelectedEntity] = useState('');
  const [dataClass, setDataClass] = useState<IClass[]>([]);
  const [coursesData, setCoursesData] = useState<CourseRep0oDTO[]>([]);
  const [search, setSearch] = useState('');
  const [searcherr, setSearchErr] = useState(false);
  const [chatLoader, setChatLoader] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState('');
  const [studentDetail] = useState<any>();
  const [chat, setchatData] = useState<any>([]);
  const [chatlist, setchatlistData] = useState<any>();
  const [selectedchat, setSelectedChat] = useState<any>([]);
  const [flagged, setFlagged] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [likedStates, setLikedStates] = useState<{ [key: string]: string }>({});
  const [isTextCopied, setIsTextCopied] = useState<any>({});
  const navigate = useNavigate();
  const callAPI = async () => {
    getData(`${chatlisturl}/${userId}`)
      .then((data: any) => {
        setchatlistData(data?.data);
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

  const saveChat = async () => {
    const chatDataString = localStorage?.getItem('chatData');
    let chatData: any;

    if (chatDataString) {
      chatData = JSON.parse(chatDataString);
    } else {
      chatData = null;
    }
    const isChatFlagged =
      chatData?.[0]?.flagged ?? localStorage?.getItem('chatsaved') === 'true';

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
        teacher_id: userId,
        chat_title: chatData?.[0]?.question,
        chat_conversation: JSON.stringify(chatData),
        flagged: isChatFlagged,
      };
    } else {
      chat_payload = {
        teacher_id: userId,
        chat_title: chatData?.[0]?.question,
        chat_conversation: JSON.stringify(chatData),
        flagged: isChatFlagged,
      };
    }
    await postDataJson(`${chataddconversationurl}`, chat_payload)
      .then(() => {
        localStorage.removeItem('chatData');
        localStorage.removeItem('chatsaved');
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
  useEffect(() => {
    if (!isExpanded && chat?.length > 0) {
      localStorage.setItem(
        'chatData',
        JSON.stringify(chat?.length ? chat : []),
      );
    }
  }, [chat, isExpanded]);

  useEffect(() => {
    if (!isExpanded) {
      const chatDataString = localStorage?.getItem('chatData');
      if (chatDataString) {
        const chatData = JSON.parse(chatDataString);

        if (chatData?.length > 0) {
          saveChat();
        }
      }
    }

    return () => {
      setIsExpanded(false);
    };
  }, [isExpanded]);
  const getTeacherInfo = () => {
    try {
      getData(`${editTeacher}/${teacherId}`).then((data) => {
        if (data?.status) {
          localStorage.setItem('teacher_id', data?.data.id);
          setTeacherData(data.data);
          if (data?.data?.course_semester_subjects != null) {
            setSelectedEntity('college');
            const courseIds = Object.keys(
              data.data.course_semester_subjects,
            ).map((CourseKey) => CourseKey);
            getCourses(courseIds);
          } else {
            setSelectedEntity('school');
            const classIds = Object.keys(data.data.class_stream_subjects).map(
              (classKey) => classKey,
            );
            getClasslist(classIds);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTeacherInfo();
  }, []);
  const getCourses = (courseIds: any) => {
    getData(`${CourseURL}`)
      .then((data) => {
        if (data.data) {
          setCoursesData(data?.data);
          const filteredCourses = data?.data?.course_data?.filter(
            (course: any) => courseIds.includes(String(course.id)),
          );
          setCoursesData(filteredCourses);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const getClasslist = (classIds: any) => {
    getData(`${ClassURL}`)
      .then((data) => {
        if (data.data) {
          const filteredClasses = data?.data?.classes_data?.filter(
            (classn: any) => classIds.includes(String(classn.id)),
          );
          setDataClass(filteredClasses);
        }
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
    setChatLoader(false);
    toast.error(e?.message, {
      hideProgressBar: true,
      theme: 'colored',
    });
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
    setchatData((prevState: any) => [...prevState, newData]);
    setChatLoader(false);
    setSearch('');
    // setShowInitialPage(false);
    getData(`${chatlisturl}/${userId}`)
      .then((data: any) => {
        setchatlistData(data?.data);
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
  const searchData = () => {
    setSearch('');

    if (search === '') {
      setSearchErr(true);
      return;
    }
    setChatLoader(true);
    setLoaderMsg('Searching result from knowledge base');
    setSearchErr(false);
    const prompt = studentDetail?.prompt?.replace('**question**', 'answer');
    let payload = {};
    // let rag_payload = {};
    if (selectedchat?.question !== '') {
      payload = {
        teacher_id: userId,
        question: search,
        prompt: prompt,
        course: teacherData?.course_name || null,
        stream: teacherData?.subject || null,
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
        teacher_id: userId,
        question: search,
        prompt: prompt,
        course: teacherData?.course_name || null,
        stream: teacherData?.subject || null,
      };
    }

    const handleResponsereg = (data: { data: any }) => {
      const newData = data;
      setSelectedChat((prevState: any) => [...prevState, newData]);
      setchatData((prevState: any) => [...prevState, newData]);
      setChatLoader(false);
      setSearch('');
      getData(`${chatlisturl}/${userId}`)
        .then((data: any) => {
          setchatlistData(data?.data);
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    };
    Promise.resolve({ status: true }) // Skipping ChatURL and faking a success
      .then((data) => {
        if (data.status) {
          if (teacherData.entity_type === 'school') {
            postDataJson(`${ChatRAGURL}`, {
              user_query: search,
              student_id: userId,
              school_college_selection: teacherData.entity_type,
              board_selection: null,
              state_board_selection: null,
              stream_selection: null,
              class_selection: teacherData.class_name || null,
              university_selection: teacherData?.university_name || null,
              college_selection: null,
              course_selection: teacherData?.course || null,
              year: null,
              subject: teacherData.subject || null,
            })
              .then((response: any) => {
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
                    teacher_id: userId,
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
                    student_id: userId,
                    class_or_course_selection: studentDetail.class.name,
                  })
                    .then((response) => {
                      if (response?.status) {
                        handleResponse(response);
                        const ChatStorepayload = {
                          teacher_id: userId,
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
                  student_id: userId,
                  class_or_course_selection: studentDetail?.class.name,
                })
                  .then((response) => {
                    if (response?.status) {
                      handleResponse(response);
                      const ChatStorepayload = {
                        teacher_id: userId,
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
              student_id: userId,
              school_college_selection: teacherData.entity_type || null,
              board_selection: null,
              state_board_selection: null,
              stream_selection: null,
              class_selection: teacherData?.class_id || null,
              university_selection: teacherData?.university_name || null,
              college_selection: teacherData?.institution_name || null,
              course_selection: teacherData?.course || null,
              year: null,
              subject: teacherData?.subject_name || null,
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
                    teacher_id: userId,
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
                    student_id: userId,
                    class_or_course_selection: teacherData?.course_name || null,
                  })
                    .then((response) => {
                      if (response?.status) {
                        handleResponse(response);
                        const ChatStorepayload = {
                          teacher_id: userId,
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
                  student_id: userId,
                  class_or_course_selection: teacherData?.course_name || null,
                })
                  .then((response) => {
                    if (response?.status) {
                      handleResponse(response);
                      const ChatStorepayload = {
                        teacher_id: userId,
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
          handleError({ message: 'An error occurred', ...data });
        }
      })
      .then((data: any) => {
        if (data?.status) {
          const ChatStorepayload = {
            teacher_id: userId,
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
            student_id: userId,
            class_or_course_selection:
              teacherData.entity_type === 'school'
                ? teacherData?.class.name || null
                : teacherData?.course_name || null,
          });
        } else if (data) {
          handleError(data);
        }
      })
      .then((data) => {
        if (data?.status) {
          const ChatStorepayload = {
            teacher_id: userId,
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
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchData();
    }
  };

  const handleFlag = () => {
    setFlagged(!flagged);
    const chatDataString = localStorage.getItem('chatData');
    if (chatDataString) {
      const chatData = JSON.parse(chatDataString);
      const updatedChatData = chatData.map((chat: any) => ({
        ...chat,
        flagged: !flagged,
      }));
      localStorage.setItem('chatData', JSON.stringify(updatedChatData));
    }
  };
  const handleExpand = () => {
    if (selectedchat?.length > 0 || chatLoader) {
      setIsExpanded(true);
      const existingChatData = localStorage.getItem('chatData');
      const expandedChatData = {
        chats: existingChatData,
        loading: chatLoader,
        loaderMessage: loaderMsg,
        pendingQuestion: search,
        studentData: studentDetail,
      };
      localStorage.setItem(
        'expandedChatData',
        JSON.stringify(expandedChatData),
      );
      localStorage.removeItem('chatData');
      navigate('/teacher-dashboard/chat/recentChat');
    }
  };
  useEffect(() => {
    localStorage.removeItem('expandedChatData');

    return () => {
      localStorage.removeItem('expandedChatData');
      setIsExpanded(false);
    };
  }, []);

  const handleRegenerate = (question: any) => {
    setChatLoader(true);
    setLoaderMsg('Fetching Data from Ollama model.');
    setSearchErr(false);
    const prompt = studentDetail?.prompt?.replace('**question**', 'answer');
    let payload = {};
    if (selectedchat?.question !== '') {
      payload = {
        question: question,
        prompt: prompt,
        course: teacherData?.course_name || null,
        stream: teacherData?.subject || null,
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
        course: teacherData?.course_name || '',
        stream: teacherData?.subject || '',
      };
    }
    postDataJson(`${ChatOLLAMAURL}`, {
      user_query: question,
      student_id: userId,
      class_or_course_selection:
        teacherData.entity_type === 'school'
          ? teacherData?.class_name || ''
          : teacherData?.course_name || '',
    })
      .then((response) => {
        if (response?.status) {
          handleResponse(response);
          const ChatStorepayload = {
            teacher_id: userId,
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
  const handleSpeak = async (text: string, index: number) => {
    stopSpeech(index);
    const textArray = Array.isArray(text) ? text : [text];
    const updatedChats = selectedchat.map((chat: any, i: number) => ({
      ...chat,
      speak: i === index, // Only the current index is true
    }));

    setSelectedChat(updatedChats);
    const speechComplete = await textToSpeech(textArray.join(' '), index);
    if (speechComplete) {
      const updatedChatsAfterSpeech = selectedchat.map(
        (chat: any, i: number) => ({
          ...chat,
          speak: i === index ? false : chat.speak, // Set the current index's speak to false
        }),
      );

      setSelectedChat(updatedChatsAfterSpeech);
    }
  };
  const handleStop = async (index: number) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    stopSpeech(index);
    // Update `speak` state for all chats
    const updatedChats = selectedchat.map((chat: any, i: number) => ({
      ...chat,
      speak: i === index ? false : chat.speak, // Set only the current index to false
    }));
    setSelectedChat(updatedChats);
  };

  const handleCopy = (index: number) => {
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
  const handleLike = (index: number) => {
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
    }
  };

  const handleDislike = (index: number) => {
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
    }
  };

  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <HomeOutlinedIcon
            sx={{
              fontSize: '26px',
              marginRight: '2px',
            }}
          />
          <div className="breadcrumb-title pe-3">Dashboard</div>
        </div>

        <div className="row  g-4 mb-4">
          <div className="col-xxl-4 col-xl-6 d-flex align-items-stretch">
            <div className="card ">
              <div className="card-body position-relative p-4">
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-3 flex-column">
                      <img
                        src={profile}
                        className="rounded-circle bg-grd-info p-1"
                        width="94"
                        height="94"
                        alt="user"
                      />
                      <div className="w-100 text-center">
                        <h4 className="fw-bold mb-1 fs-4">
                          {teacherData?.first_name} {teacherData?.last_name}
                        </h4>
                        <p className="opacity-75 mb-1">
                          {teacherData?.university_id}
                        </p>
                        <p className="planbg">Senior Professor</p>
                      </div>
                      <div className="curcc">
                        {selectedEntity === 'college' ? (
                          <>
                            <h6>CURRENT COURSES</h6>
                            <ul>
                              {coursesData?.map((item, index) => (
                                <li key={index}>{item.course_name}</li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <>
                            <h6>CURRENT CLASSES</h6>
                            <ul>
                              {dataClass?.map((item, index) => (
                                <li key={index}>{item.class_name}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <h5 className="mb-1 fw-bold fs-4">Your Classes</h5>
            <p className="text-secondary">
              Manage your classes and view student information
            </p>

            <div className="swiper-container">
              <Swiper
                spaceBetween={24}
                slidesPerView={3}
                loop={true}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                modules={[Navigation]}
                breakpoints={{
                  320: { slidesPerView: 1 }, // Mobile
                  640: { slidesPerView: 1 }, // Tablets
                  1024: { slidesPerView: 2 }, // Laptops
                  1440: { slidesPerView: 3 }, // Large Screens
                }}
              >
                <SwiperSlide>
                  <div className="card mb-0">
                    <div className="card-body">
                      <div className="carddlex">
                        <span>
                          <AttractionsIcon />
                        </span>
                        <div className="">
                          <h6 className="fs-4">Grade 11</h6>
                          <p> Physics</p>
                        </div>
                      </div>

                      <div className="row g-2">
                        <div className="col-lg-6">
                          <div className="totallist">
                            <span>
                              <SupervisedUserCircleIcon />
                            </span>
                            <div className="">
                              <h6>Total Students</h6> <p>50</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="totallist">
                            <span>
                              <StreamIcon />
                            </span>
                            <div className="">
                              <h6>Stream</h6> <p>Science</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-primary mt-4 w-100"
                        onClick={() =>
                          navigate('/teacher-dashboard/student-details')
                        }
                      >
                        View Students
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="card mb-0">
                    <div className="card-body">
                      <div className="carddlex">
                        <span>
                          <PercentIcon />
                        </span>
                        <div className="">
                          <h6 className="fs-4">Grade 10</h6>
                          <p>Maths</p>
                        </div>
                      </div>

                      <div className="totallist">
                        <span>
                          <SupervisedUserCircleIcon />
                        </span>
                        <div className="">
                          <h6>Total Students</h6> <p>50</p>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-primary mt-4 w-100"
                        onClick={() =>
                          navigate('/teacher-dashboard/student-details')
                        }
                      >
                        View Students
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="card mb-0">
                    <div className="card-body">
                      <div className="carddlex">
                        <span>
                          <PercentIcon />
                        </span>
                        <div className="">
                          <h6 className="fs-4">Grade 10</h6>
                          <p>Maths</p>
                        </div>
                      </div>

                      <div className="totallist">
                        <span>
                          <SupervisedUserCircleIcon />
                        </span>
                        <div className="">
                          <h6>Total Students</h6> <p>50</p>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-primary mt-4 w-100"
                        onClick={() =>
                          navigate('/teacher-dashboard/student-details')
                        }
                      >
                        View Students
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="card mb-0">
                    <div className="card-body">
                      <div className="carddlex">
                        <span>
                          <PercentIcon />
                        </span>
                        <div className="">
                          <h6 className="fs-4">Grade 10</h6>
                          <p>Maths</p>
                        </div>
                      </div>

                      <div className="totallist">
                        <span>
                          <SupervisedUserCircleIcon />
                        </span>
                        <div className="">
                          <h6>Total Students</h6> <p>50</p>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-primary mt-4 w-100"
                        onClick={() =>
                          navigate('/teacher-dashboard/student-details')
                        }
                      >
                        View Students
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="card mb-0">
                    <div className="card-body">
                      <div className="carddlex">
                        <span>
                          <PercentIcon />
                        </span>
                        <div className="">
                          <h6 className="fs-4">Grade 10</h6>
                          <p>Maths</p>
                        </div>
                      </div>

                      <div className="totallist">
                        <span>
                          <SupervisedUserCircleIcon />
                        </span>
                        <div className="">
                          <h6>Total Students</h6> <p>50</p>
                        </div>
                      </div>

                      <button
                        className="btn btn-outline-primary mt-4 w-100"
                        onClick={() =>
                          navigate('/teacher-dashboard/student-details')
                        }
                      >
                        View Students
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
              <div className="swiper-button-prev"></div>
              <div className="swiper-button-next"></div>
            </div>
          </div>
        </div>

        <div className="row">
          <TeacherDashboardCharts />
          <TeacherGraph />
          <div
            className="col-xxl-8 d-flex align-items-stretch "
            style={{ marginBottom: '64px' }}
          >
            <ChatComponent
              robotImage={robotimg}
              logo={glogowhite}
              selectedchat={selectedchat}
              chatLoader={chatLoader}
              loaderMsg={loaderMsg}
              search={search}
              setSearch={setSearch}
              searcherr={searcherr}
              onSearch={searchData}
              onFlag={handleFlag}
              flagged={flagged}
              onExpand={handleExpand}
              onRegenerate={handleRegenerate}
              onSpeak={handleSpeak}
              onStop={handleStop}
              onCopy={handleCopy}
              onLike={handleLike}
              onDislike={handleDislike}
              onKeyDown={handleKeyDown}
              showExpandButton={true}
              showFlagButton={true}
              showFooter={true}
              isTextCopied={isTextCopied}
              likedStates={likedStates}
            />
          </div>
          <div
            className="col-xxl-4 d-flex align-items-stretch "
            style={{ marginTop: '40px' }}
          >
            <div className="card w-100">
              <div className="card-body">
                <h6 className="text-center mb-5 fs-18">Top Students</h6>
                <ul className="topper-chart">
                  <li>
                    <div className="topper-image">
                      <img src={toperstudent} alt="" />
                    </div>
                    <span className="name">Andrew</span>
                    <div className="bar">2</div>
                  </li>

                  <li>
                    <div className="topper-image">
                      <img src={toperstudent} alt="" />
                    </div>
                    <span className="name">Joseph</span>
                    <div className="bar">1</div>
                  </li>

                  <li>
                    <div className="topper-image">
                      <img src={toperstudent} alt="" />
                    </div>
                    <span className="name">Kareen</span>
                    <div className="bar">3 </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SessionTracker userId={userId ? userId : ''} />
    </div>
  );
};

export default TeacherDash;
