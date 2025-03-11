/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
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
//mport PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
//import MenuBookIcon from '@mui/icons-material/MenuBook';
import NoteIcon from '@mui/icons-material/Note';
import ArticleIcon from '@mui/icons-material/Article';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CloseIcon from '@mui/icons-material/Close';

// Dummy Data
const videoLectures: VideoLecture[] = [
  {
    id: 1,
    title: 'Introduction to Machine Learning',
    instructor: 'Dr. Sarah Johnson',
    duration: '1h 45m',
    views: '15.2K',
    image:
      'https://plus.unsplash.com/premium_photo-1695186450459-8d3c896ca573?q=80&w=768',
    videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
  },
  {
    id: 2,
    title: 'Advanced Data Structures',
    instructor: 'Prof. Michael Chen',
    duration: '2h 15m',
    views: '12.8K',
    image:
      'https://plus.unsplash.com/premium_photo-1695186450459-8d3c896ca573?q=80&w=768',
    videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
  },
  {
    id: 3,
    title: 'Quantum Computing Basics',
    instructor: 'Dr. Robert Wilson',
    duration: '1h 30m',
    views: '9.5K',
    image:
      'https://plus.unsplash.com/premium_photo-1695186450459-8d3c896ca573?q=80&w=768',
    videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
  },
  {
    id: 4,
    title: 'Web Development Fundamentals',
    instructor: 'Emily Parker',
    duration: '2h 30m',
    views: '18.3K',
    image:
      'https://plus.unsplash.com/premium_photo-1695186450459-8d3c896ca573?q=80&w=768',
    videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
  },
  {
    id: 5,
    title: 'Artificial Intelligence Ethics',
    instructor: 'Prof. David Lee',
    duration: '1h 55m',
    views: '11.7K',
    image:
      'https://plus.unsplash.com/premium_photo-1695186450459-8d3c896ca573?q=80&w=768',
    videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
  },
  {
    id: 6,
    title: 'Mobile App Development',
    instructor: 'Jennifer Smith',
    duration: '2h 10m',
    views: '14.1K',
    image:
      'https://plus.unsplash.com/premium_photo-1695186450459-8d3c896ca573?q=80&w=768',
    videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY',
  },
];

const ebooks = [
  {
    id: 1,
    title: 'Data Science Handbook',
    author: 'Jake VandePlas',
    image: 'https://source.unsplash.com/400x250/?book,reading',
    fileUrl:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 2,
    title: 'Modern JavaScript',
    author: 'Eric Elliott',
    image: 'https://source.unsplash.com/400x250/?library,books',
    fileUrl:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 3,
    title: 'Python for Beginners',
    author: 'Mark Lutz',
    image: 'https://source.unsplash.com/400x250/?python,programming',
    fileUrl:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: 4,
    title: 'Clean Code',
    author: 'Robert Martin',
    image: 'https://source.unsplash.com/400x250/?clean,code',
    fileUrl:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
];

const notes = [
  {
    title: 'Database Systems Architecture',
    description:
      'Comprehensive notes on DBMS architecture and design principles',
    category: 'Computer Science',
    updated: '2 days ago',
  },
  {
    title: 'Neural Networks Fundamentals',
    description: 'Key concepts and mathematical foundations of neural networks',
    category: 'Machine Learning',
    updated: '1 week ago',
  },
  {
    title: 'Software Design Patterns',
    description: 'Common design patterns and their implementations',
    category: 'Software Engineering',
    updated: '3 days ago',
  },
];

const researchPapers = [
  {
    title: 'Advances in Quantum Computing Algorithms',
    authors: 'Johnson, M., et al.',
    published: '2024',
    citations: '156',
  },
  {
    title: 'Deep Learning in Medical Imaging',
    authors: 'Smith, A., Wilson, B.',
    published: '2023',
    citations: '234',
  },
  {
    title: 'Sustainable Computing Practices',
    authors: 'Brown, C., Davis, E.',
    published: '2024',
    citations: '89',
  },
];

interface VideoLecture {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  views: string;
  image: string;
  videoUrl: string; // Add this for video playback
}

interface Ebook {
  id: number;
  title: string;
  author: string;
  image: string;
  fileUrl: string; // Add this for PDF/DOC preview
}

interface Note {
  title: string;
  description: string;
  category: string;
  updated: string;
}

interface ResearchPaper {
  title: string;
  authors: string;
  published: string;
  citations: string;
}

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
  const [tabIndex, setTabIndex] = useState(0);

  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [docOpen, setDocOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState('');

  const handleVideoOpen = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setVideoOpen(true);
  };

  const handleDocOpen = (pdfUrl: string) => {
    setSelectedDoc(pdfUrl);
    setDocOpen(true);
  };

  return (
    <div>
      <div className="main-wrapper">
        <div className="main-content">
          <Box sx={{ width: '100%', px: 0 }} className="custom-box">
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Course Library
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
              data={videoLectures}
              render={(videos: VideoLecture[]) => (
                <div className="row g-4">
                  {videos.map((video: VideoLecture) => (
                    <div className="col-lg-3" key={video.id}>
                      <Card
                        onClick={() => handleVideoOpen(video.videoUrl)}
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
                          image={video.image}
                          alt={video.title}
                        />
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold">
                            {video.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ⏳ {video.duration} &nbsp; 👁️ {video.views}
                          </Typography>
                          <Typography variant="body2" fontWeight="500" mt={1}>
                            👤 {video.instructor}
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
              data={ebooks}
              render={(books: Ebook[]) => (
                <Grid container spacing={2}>
                  {books.map((book: Ebook) => (
                    <Grid item xs={12} sm={6} md={3} key={book.id}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          boxShadow: 2,
                          textAlign: 'center',
                          p: 2,
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={book.image}
                          alt={book.title}
                        />
                        <CardContent>
                          <Typography variant="h6">{book.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {book.author}
                          </Typography>
                          <Button
                            onClick={() => handleDocOpen(book.fileUrl)}
                            variant="contained"
                            sx={{ mt: 2, backgroundColor: 'purple' }}
                          >
                            Read Now
                          </Button>
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
              data={notes}
              render={(notes: Note[]) => (
                <Box>
                  {notes.map((note: Note, index: number) => (
                    <Typography key={index} variant="body1" sx={{ mb: 2 }}>
                      <strong>{note.title}</strong> - {note.description}{' '}
                      <i>({note.updated})</i>
                    </Typography>
                  ))}
                </Box>
              )}
            />

            <TabPanel
              value={tabIndex}
              index={3}
              data={researchPapers}
              render={(papers: ResearchPaper[]) => (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Authors</TableCell>
                        <TableCell>Published</TableCell>
                        <TableCell>Citations</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {papers.map((paper: ResearchPaper, i: number) => (
                        <TableRow key={i}>
                          <TableCell>{paper.title}</TableCell>
                          <TableCell>{paper.authors}</TableCell>
                          <TableCell>{paper.published}</TableCell>
                          <TableCell>{paper.citations}</TableCell>
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

          <Dialog
            open={docOpen}
            onClose={() => setDocOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogContent>
              <IconButton
                onClick={() => setDocOpen(false)}
                sx={{ position: 'absolute', right: 10, top: 10 }}
              >
                <CloseIcon />
              </IconButton>
              <iframe
                width="100%"
                height="600"
                src={selectedDoc}
                frameBorder="0"
              ></iframe>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default StudentContent;
