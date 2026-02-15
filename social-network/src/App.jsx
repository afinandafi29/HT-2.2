import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import AuthForm from './pages/Login';
import ProfileCard from './pages/Profile';
import SinglePostPage from './pages/SinglePost';
import Post from './pages/Post';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import AuthCallback from './pages/AuthCallback';
import Layout from './components/Layout/Layout';
import FeedPage from './pages/FeedPage';
import FAQ from './pages/FAQ';
import OmegleLanding from './pages/OmegleLanding';
import OmegleSession from './pages/OmegleSession';
import PremiumPage from './pages/PremiumPage';
import NewsHome from './pages/News/NewsHome';
import NewsSearch from './pages/News/NewsSearch';
import NewsArticleDetail from './pages/News/NewsArticleDetail';
import NewsTopStories from './pages/News/NewsTopStories';
import YouTube from './pages/YouTube';
import Chat from './pages/Chat';
import OneToOne from './pages/OneToOne';
import Music from './pages/Music';
import LiveTV from './pages/LiveTV';
import Admin from './pages/Admin';
import AIChat from './pages/AIChat';
import AIGitHubChat from './pages/AIGitHubChat';
import Apps from './pages/Apps';
import Learning from './pages/Learning';
import LearningLanguages from './pages/LearningLanguages';
import BasicLearning from './pages/BasicLearning';
import iPadHome from './pages/iPadHome';
import EnglishQuiz from './pages/EnglishQuiz';
import SpanishQuiz from './pages/SpanishQuiz';
import FrenchQuiz from './pages/FrenchQuiz';
import JapaneseQuiz from './pages/JapaneseQuiz';
import GermanQuiz from './pages/GermanQuiz';
import KoreanQuiz from './pages/KoreanQuiz';
import ItalianQuiz from './pages/ItalianQuiz';
import ChineseQuiz from './pages/ChineseQuiz';
import HindiQuiz from './pages/HindiQuiz';
import RussianQuiz from './pages/RussianQuiz';
import PortugueseQuiz from './pages/PortugueseQuiz';
import TurkishQuiz from './pages/TurkishQuiz';
import DutchQuiz from './pages/DutchQuiz';
import GreekQuiz from './pages/GreekQuiz';
import VietnameseQuiz from './pages/VietnameseQuiz';
import PolishQuiz from './pages/PolishQuiz';
import SwedishQuiz from './pages/SwedishQuiz';
import LatinQuiz from './pages/LatinQuiz';
import IndonesianQuiz from './pages/IndonesianQuiz';
import Calculator from './pages/Calculator';
import CalendarApp from './pages/CalendarApp';
import ClockApp from './pages/ClockApp';
import NotesApp from './pages/NotesApp';
import RemindersApp from './pages/RemindersApp';
import CompassApp from './pages/CompassApp';
import './styles/main.css';
import './styles/mobile.css';

// Protected Route component
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/in" />;
}

// Public Route component (for login/register)
function PublicRoute({ children }) {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/" />;
}

function App() {
  console.log('App component rendering');

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/in" element={
          <PublicRoute>
            <AuthForm />
          </PublicRoute>
        } />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Public pages that don't need the main layout */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/admin" element={<Admin />} />

        {/* Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jitsi" element={<Home />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/post" element={<Post />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfileCard />
            </PrivateRoute>
          } />
          <Route path="/profile/:userId" element={
            <PrivateRoute>
              <ProfileCard />
            </PrivateRoute>
          } />
          <Route path="/posts/:postId" element={<SinglePostPage />} />
          <Route path="/create-room" element={
            <PrivateRoute>
              <div>Create Room Page Placeholder</div>
            </PrivateRoute>
          } />

          {/* 1-to-1 Chat Routes */}
          <Route path="/1to1" element={<OneToOne />} />
          <Route path="/premium" element={<PremiumPage />} />


          {/* News Routes */}
          <Route path="/news" element={<NewsHome />} />
          <Route path="/news/top" element={<NewsTopStories />} />
          <Route path="/news/search" element={<NewsSearch />} />
          <Route path="/news/article/:uuid" element={<NewsArticleDetail />} />

          {/* YouTube Route */}
          <Route path="/youtube" element={<YouTube />} />

          {/* Chat Route */}
          <Route path="/chat" element={<Chat />} />

          {/* Music Route */}
          <Route path="/music" element={<Music />} />
          <Route path="/music/callback" element={<Music />} />

          {/* Live Route */}
          <Route path="/live" element={<LiveTV />} />



          {/* Apps Route */}
          <Route path="/apps" element={<Apps />} />
          <Route path="/ai-chat" element={<AIChat />} />

          {/* Learning Route */}
          <Route path="/learning" element={<Learning />} />

          {/* Learning Languages Route */}
          <Route path="/learning-languages" element={<LearningLanguages />} />
          <Route path="/basic-learning" element={<BasicLearning />} />

          {/* iPad Home Route */}
          <Route path="/ipad" element={<iPadHome />} />

          {/* Quiz Routes */}
          <Route path="/english-quiz" element={<EnglishQuiz />} />
          <Route path="/spanish-quiz" element={<SpanishQuiz />} />
          <Route path="/french-quiz" element={<FrenchQuiz />} />
          <Route path="/japanese-quiz" element={<JapaneseQuiz />} />
          <Route path="/german-quiz" element={<GermanQuiz />} />
          <Route path="/korean-quiz" element={<KoreanQuiz />} />
          <Route path="/italian-quiz" element={<ItalianQuiz />} />
          <Route path="/chinese-quiz" element={<ChineseQuiz />} />
          <Route path="/hindi-quiz" element={<HindiQuiz />} />
          <Route path="/russian-quiz" element={<RussianQuiz />} />
          <Route path="/portuguese-quiz" element={<PortugueseQuiz />} />
          <Route path="/turkish-quiz" element={<TurkishQuiz />} />
          <Route path="/dutch-quiz" element={<DutchQuiz />} />
          <Route path="/greek-quiz" element={<GreekQuiz />} />
          <Route path="/vietnamese-quiz" element={<VietnameseQuiz />} />
          <Route path="/polish-quiz" element={<PolishQuiz />} />
          <Route path="/swedish-quiz" element={<SwedishQuiz />} />
          <Route path="/latin-quiz" element={<LatinQuiz />} />
          <Route path="/indonesian-quiz" element={<IndonesianQuiz />} />

          {/* Utility Apps Routes */}
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/calendar-app" element={<CalendarApp />} />
          <Route path="/clock-app" element={<ClockApp />} />
          <Route path="/notes-app" element={<NotesApp />} />
          <Route path="/reminders-app" element={<RemindersApp />} />
          <Route path="/compass-app" element={<CompassApp />} />
        </Route >

        {/* 404 No Found route */}
        < Route path="*" element={< Navigate to="/" replace />} />
      </Routes >
    </Router >
  );
}

export default App;