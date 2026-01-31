import React from 'react';
import Home from "./Pages/Home.jsx";
import InterviewTips from "./components/InterviewTips.jsx";
import Header from "./components/header.jsx";
import Footer from "./components/Footer.jsx";
import Login from './components/Login.jsx';
import ContactUs from './components/ContactUs.jsx';
import Eror404 from './components/Eror404.jsx'; 
import AboutUs from './components/AboutUs.jsx';
import Reports from './Pages/Reports.jsx';
import Profile from './Pages/Profile.jsx';
import Settings from './Pages/Settings.jsx';
import QuestionBank from './Pages/QuestionBank.jsx';
import Faq from './Pages/Faq.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import "./App.css";
import Dashboard from './Pages/Dashboard.jsx';
import InterviewSetup from './Pages/InterviewSetup.jsx';
import ChatInterview from './Pages/ChatInterview.jsx';
import VideoInterview from './Pages/VideoInterview.jsx';
import VoiceInterview from './Pages/VoiceInterview.jsx';
import Questions from './Pages/Questions.jsx';
import { Privacy, Terms, Cookies, GDPR } from './Pages/LegalPage.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <><Header/><Home/><Footer/></>
    },
    {
      path: "/login",
      element: <><Header/><Login/></>
    },
    {
      path: "/dashboard",
      element: <><Header/><Dashboard/></>
    },
    {
      path: "/interviewtips",
      element: <><Header/><InterviewTips/><Footer/></>
    },
    {
      path: "/contactus",
      element: <><Header/><ContactUs/><Footer/></>
    },
    {
      path: "/aboutus",
      element: <><Header/><AboutUs/><Footer/></>
    },
    {
      path: "/reports",
      element: <><Header/><Reports/><Footer/></>
    },
    {
      path: "/profile",
      element: <><Header/><Profile/><Footer/></>
    },
    {
      path: "/question",
      element: <><Header/><QuestionBank/><Footer/></>
    },
    {
      path: "/settings",
      element: <><Header/><Settings/><Footer/></>
    },
    {
      path: "/Faq",
      element: <><Header/><Faq/><Footer/></>
    },
    {
      path: "/faq",
      element: <><Header/><Faq/><Footer/></>
    },
    {
      path: "/interviewsetup",
      element: <><Header/><InterviewSetup/><Footer/></>
    },
    {
      path: "/chat-interview",
      element: <><ChatInterview/></>
    },
    {
      path: "/video-interview",
      element: <><VideoInterview/></>
    },
    {
      path: "/voice-interview",
      element: <><VoiceInterview/></>
    },
    {
      path: "/questions/:topic",
      element: <><Header/><Questions/><Footer/></>
    },
    {
      path: "/privacy",
      element: <><Header/><Privacy/><Footer/></>
    },
    {
      path: "/terms",
      element: <><Header/><Terms/><Footer/></>
    },
    {
      path: "/cookies",
      element: <><Header/><Cookies/><Footer/></>
    },
    {
      path: "/gdpr",
      element: <><Header/><GDPR/><Footer/></>
    },
    {
      path: "*",
      element: <><Header/><Eror404/><Footer/></>
    }
  ])
    return (
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    )
}

export default App;