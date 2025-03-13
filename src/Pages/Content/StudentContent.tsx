/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogContent,
  IconButton,
} from '@mui/material';
import NoteIcon from '@mui/icons-material/Note';
import ArticleIcon from '@mui/icons-material/Article';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CloseIcon from '@mui/icons-material/Close';
import Ebook from './../../assets/img/ebook.jpg';
import useApi from '../../hooks/useAPI';
import {
  QUERY_KEYS_CONTENT,
  QUERY_KEYS_SEMESTER,
  QUERY_KEYS_STUDENT,
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL,
} from '../../utils/const';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import NameContext from '../Context/NameContext';

const TabPanel: React.FC<{
  value: number;
  index: number;
  data: any[];
  render: (data: any) => JSX.Element;
}> = ({ value, index, data, render }) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          {data.length > 0 ? (
            render(data)
          ) : (
            <Typography variant="h6" color="textSecondary" align="center">
              No Data Available
            </Typography>
          )}
        </Box>
      )}
    </div>
  );
};

const StudentContent = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const ContentURL = QUERY_KEYS_CONTENT.GET_CONTENT;

  const [tabIndex, setTabIndex] = useState(0);

  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('');
  const { getData } = useApi();
  const navigate = useNavigate();
  const [videoLectures, setVideoLectures] = useState([]);
  const [ebooks, setEBooks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [researchPapers, setResearchPapers] = useState([]);
  const user_uuid = localStorage.getItem('user_uuid');
  const [studentProfile, setStudentProfile] = useState<any>({});
  const [collegeSubjects, setCollegeSubjects] = useState<any[]>([]);
  const [schoolSubjects, setSchoolSubjects] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [filteredVideoLectures, setFilteredVideoLectures] = useState([]);
  const [filteredEBooks, setFilteredEBooks] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [filteredResearchPapers, setFilteredResearchPapers] = useState([]);

  const handleVideoOpen = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setVideoOpen(true);
  };

  const callAPI = async () => {
    try {
      const [collegeSubjectData, schoolSubjectData, semesterData] =
        await Promise.all([
          getData(`${QUERY_KEYS_SUBJECT.GET_SUBJECT}`),
          getData(`${QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT}`),
          getData(`${QUERY_KEYS_SEMESTER.GET_SEMESTER}`),
        ]);

      const college_subs = collegeSubjectData.data.subjects_data;
      const school_subs = schoolSubjectData.data.subjects_data;

      const studentProfileData = await getData(
        `${QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE}/${user_uuid}`,
      );

      if (studentProfileData.status) {
        const studentPreference = studentProfileData?.data?.subject_preference;
        const studentCourseId = studentPreference?.course_id;
        const studentClassId = studentProfileData?.data?.class.id;

        setStudentProfile(studentProfileData?.data);

        const contentData = await getData(`${ContentURL}`);

        if (studentProfileData?.data.entity_name === 'college') {
          const semester = semesterData.data.semesters_data.find(
            (sem: any) =>
              sem.semester_id ==
              studentProfileData?.data.subject_preference.sem_id,
          );

          const filteredSub = college_subs.filter(
            (sub: any) =>
              sub.course_id ==
                studentProfileData?.data.subject_preference.course_id &&
              sub.semester_id == semester.semester_id,
          );

          setCollegeSubjects(filteredSub);
          if (contentData.status) {
            const filteredContents = contentData?.data?.contents_data.filter(
              (content: any) => {
                const courseSubjects = content.course_semester_subjects
                  ? JSON.parse(content.course_semester_subjects)
                  : {};
                return Object.prototype.hasOwnProperty.call(
                  courseSubjects,
                  studentCourseId,
                );
              },
            );

            setVideoLectures(
              filteredContents.filter(
                (item: any) => item.content_type === 'video_lecture',
              ),
            );
            setEBooks(
              filteredContents.filter(
                (item: any) => item.content_type === 'e-book',
              ),
            );
            setNotes(
              filteredContents.filter(
                (item: any) => item.content_type === 'notes',
              ),
            );
            setResearchPapers(
              filteredContents.filter(
                (item: any) => item.content_type === 'research_paper',
              ),
            );
          }
        } else if (studentProfileData?.data.entity_name === 'school') {
          if (
            studentProfileData?.data.class.name === 'class_11' ||
            studentProfileData?.data.class.name === 'class_12'
          ) {
            const filteredSub = school_subs.filter(
              (sub: any) =>
                sub.class_id == studentProfileData?.data.class.id &&
                studentProfileData?.data.academic_history.stream == sub.stream,
            );

            setSchoolSubjects(filteredSub);
            if (contentData.status) {
              const filteredContents = contentData?.data?.contents_data.filter(
                (content: any) => {
                  const classSubjects = content.class_stream_subjects
                    ? JSON.parse(content.class_stream_subjects)
                    : {};
                  return Object.prototype.hasOwnProperty.call(
                    classSubjects,
                    studentClassId,
                  );
                },
              );

              setVideoLectures(
                filteredContents.filter(
                  (item: any) => item.content_type === 'video_lecture',
                ),
              );
              setEBooks(
                filteredContents.filter(
                  (item: any) => item.content_type === 'e-book',
                ),
              );
              setNotes(
                filteredContents.filter(
                  (item: any) => item.content_type === 'notes',
                ),
              );
              setResearchPapers(
                filteredContents.filter(
                  (item: any) => item.content_type === 'research_paper',
                ),
              );
            }
          } else {
            const filteredSub = school_subs.filter(
              (sub: any) => sub.class_id == studentProfileData?.data.class.id,
            );

            setSchoolSubjects(filteredSub);
            if (contentData.status) {
              const filteredContents = contentData?.data?.contents_data.filter(
                (content: any) => {
                  const classSubjects = content.class_stream_subjects
                    ? JSON.parse(content.class_stream_subjects)
                    : {};
                  return Object.prototype.hasOwnProperty.call(
                    classSubjects,
                    studentClassId,
                  );
                },
              );

              setVideoLectures(
                filteredContents.filter(
                  (item: any) => item.content_type === 'video_lecture',
                ),
              );
              setEBooks(
                filteredContents.filter(
                  (item: any) => item.content_type === 'e-book',
                ),
              );
              setNotes(
                filteredContents.filter(
                  (item: any) => item.content_type === 'notes',
                ),
              );
              setResearchPapers(
                filteredContents.filter(
                  (item: any) => item.content_type === 'research_paper',
                ),
              );
            }
          }
        } else {
          setVideoLectures([]);
          setEBooks([]);
          setNotes([]);
          setResearchPapers([]);
        }
      }
    } catch (e: any) {
      if (e?.response?.code === 401) {
        navigate('/');
      }
      toast.error(e?.message, {
        hideProgressBar: true,
        theme: 'colored',
      });
    }
  };
  useEffect(() => {
    callAPI();
  }, []);

  const handleSubjectChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setActiveSubTab(newValue);
  };

  useEffect(() => {
    if (
      collegeSubjects.length > 0 &&
      activeSubTab >= 0 &&
      activeSubTab < collegeSubjects.length
    ) {
      const activeSubject = collegeSubjects[activeSubTab];

      const filterContentBySubject = (contentArray: any) => {
        return contentArray.filter((item: any) => {
          const courseSubjects = item.course_semester_subjects
            ? JSON.parse(item.course_semester_subjects)
            : {};
          const studentCourseId = studentProfile?.subject_preference?.course_id;

          if (
            Object.prototype.hasOwnProperty.call(
              courseSubjects,
              studentCourseId,
            )
          ) {
            const subjectsForCourse = courseSubjects[studentCourseId];

            return Object.values(subjectsForCourse).some((subjects: any) =>
              subjects?.includes(activeSubject.subject_name),
            );
          }
          return false;
        });
      };

      setFilteredVideoLectures(filterContentBySubject(videoLectures));
      setFilteredEBooks(filterContentBySubject(ebooks));
      setFilteredNotes(filterContentBySubject(notes));
      setFilteredResearchPapers(filterContentBySubject(researchPapers));
    } else if (
      schoolSubjects.length > 0 &&
      activeSubTab >= 0 &&
      activeSubTab < schoolSubjects.length
    ) {
      const activeSubject = schoolSubjects[activeSubTab];

      const filterContentBySubject = (contentArray: any) => {
        return contentArray.filter((item: any) => {
          const classSubjects = item.class_stream_subjects
            ? JSON.parse(item.class_stream_subjects)
            : {};
          const studentCourseId = studentProfile?.class.id;

          if (
            Object.prototype.hasOwnProperty.call(classSubjects, studentCourseId)
          ) {
            const subjectsForClass = classSubjects[studentCourseId];
            return Object.values(subjectsForClass).some((subjects: any) =>
              subjects?.includes(activeSubject.subject_name),
            );
          }
          return false;
        });
      };

      setFilteredVideoLectures(filterContentBySubject(videoLectures));
      setFilteredEBooks(filterContentBySubject(ebooks));
      setFilteredNotes(filterContentBySubject(notes));
      setFilteredResearchPapers(filterContentBySubject(researchPapers));
    }
  }, [
    activeSubTab,
    collegeSubjects,
    schoolSubjects,
    videoLectures,
    ebooks,
    notes,
    researchPapers,
    studentProfile,
  ]);

  return (
    <div>
      <div className="main-wrapper">
        <div className="main-content">
          <Box sx={{ width: '100%', px: 0 }} className="custom-box">
            {/* <Typography variant="h5" fontWeight="bold" mb={2}>
              Course Library
            </Typography> */}
            {studentProfile?.entity_name === 'college' && (
              <>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  {studentProfile?.subject_preference?.course_name}
                </Typography>
                <Typography variant="h6" mb={2}>
                  Semester {collegeSubjects[0]?.semester_number}
                </Typography>
              </>
            )}
            {studentProfile?.entity_name === 'school' && (
              <>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  {studentProfile?.class.name}
                </Typography>
                {studentProfile?.academic_history.stream && (
                  <Typography variant="h6" mb={2}>
                    {studentProfile?.academic_history.stream}
                  </Typography>
                )}
              </>
            )}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeSubTab} onChange={handleSubjectChange}>
                {studentProfile &&
                !Array.isArray(studentProfile) &&
                studentProfile?.entity_name === 'college'
                  ? collegeSubjects.map((sub) => {
                      return (
                        <Tab
                          key={sub?.subject_id}
                          label={sub?.subject_name}
                          sx={{
                            color: namecolor === 'dark' ? 'white' : 'black',
                          }}
                        />
                      );
                    })
                  : schoolSubjects.map((sub) => {
                      return (
                        <Tab
                          key={sub?.subject_id}
                          label={sub?.subject_name}
                          sx={{
                            color: namecolor === 'dark' ? 'white' : 'black',
                          }}
                        />
                      );
                    })}
              </Tabs>
              <Tabs
                value={tabIndex}
                onChange={(_, newValue) => setTabIndex(newValue)}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable full width tabs example"
              >
                <Tab
                  icon={<PlayCircleOutlineIcon />}
                  iconPosition="start"
                  label="Video Lectures"
                />
                <Tab
                  icon={<MenuBookIcon />}
                  iconPosition="start"
                  label="E-Books"
                />
                <Tab icon={<NoteIcon />} iconPosition="start" label="Notes" />
                <Tab
                  icon={<ArticleIcon />}
                  iconPosition="start"
                  label="Research Papers"
                />
              </Tabs>
            </Box>
            <TabPanel
              value={tabIndex}
              index={0}
              data={filteredVideoLectures}
              render={(videos: any[]) => (
                <div className="row g-4">
                  {videos.map((video: any) => (
                    <div className="col-lg-3" key={video.id}>
                      <Card
                        onClick={() => handleVideoOpen(video.url[0].url)}
                        sx={{
                          borderRadius: 2,
                          boxShadow: 2,
                          height: '100%',
                          cursor: 'pointer',
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="180"
                          image="https://plus.unsplash.com/premium_photo-1695186450459-8d3c896ca573?q=80&w=768"
                          alt={video.title}
                        />
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold">
                            {video.description}
                          </Typography>

                          <Typography variant="body2" fontWeight="500" mt={1}>
                            👤 {video.author}
                          </Typography>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            />
            <TabPanel
              value={tabIndex}
              index={1}
              data={filteredEBooks}
              render={(books: any[]) => (
                <Grid container spacing={2}>
                  {books.map((book: any) => (
                    <Grid item xs={12} sm={6} md={3} key={book.id}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          boxShadow: 2,
                          textAlign: 'center',

                          height: '100%',
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={Ebook}
                          height="180"
                          alt={book.description}
                        />
                        <CardContent>
                          <Typography variant="h6">
                            {book.description}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            👤 {book.author}
                          </Typography>

                          <a
                            href={book.url[0].url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button
                              variant="contained"
                              sx={{ mt: 2, backgroundColor: 'purple' }}
                            >
                              Read Now
                            </Button>
                          </a>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            />
            <TabPanel
              value={tabIndex}
              index={2}
              data={filteredNotes}
              render={(notes: any[]) => (
                <Box>
                  {notes.map((note: any, index: number) => (
                    <div key={index} className="mt-4">
                      <Typography key={index} variant="body1" sx={{}}>
                        <strong>{note.description}</strong>
                      </Typography>

                      {note?.url.map((url: any) => {
                        return (
                          <div key={url.id} className="mt-2">
                            <a href={url.url} target="_blank" rel="noreferrer">
                              {url.url}
                            </a>
                            <br></br>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </Box>
              )}
            />

            <TabPanel
              value={tabIndex}
              index={3}
              data={filteredResearchPapers}
              render={(papers: any[]) => (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>

                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Authors
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>
                          Published
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Link</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {papers.map((paper: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell>{paper.description}</TableCell>

                          <TableCell>{paper.author}</TableCell>
                          <TableCell>{paper.created_at}</TableCell>
                          <TableCell>
                            <a
                              href={paper.url[0].url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {paper.url[0].url}
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            />
          </Box>

          <Dialog
            open={videoOpen}
            onClose={() => setVideoOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogContent>
              <IconButton
                onClick={() => setVideoOpen(false)}
                sx={{ position: 'absolute', right: 10, top: 10 }}
              >
                <CloseIcon />
              </IconButton>
              <iframe
                width="100%"
                height="400"
                src={selectedVideo}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default StudentContent;
