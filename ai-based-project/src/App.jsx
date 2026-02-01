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
import RequireAuth from './components/RequireAuth.jsx';

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
      element: <RequireAuth><><Header/><Dashboard/></></RequireAuth>
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
      element: <RequireAuth><><Header/><Reports/><Footer/></></RequireAuth>
    },
    {
      path: "/profile",
      element: <RequireAuth><><Header/><Profile/><Footer/></></RequireAuth>
    },
    {
      path: "/question",
      element: <RequireAuth><><Header/><QuestionBank/><Footer/></></RequireAuth>
    },
    {
      path: "/settings",
      element: <RequireAuth><><Header/><Settings/><Footer/></></RequireAuth>
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
      element: <RequireAuth><><Header/><InterviewSetup/><Footer/></></RequireAuth>
    },
    {
      path: "/chat-interview",
      element: <RequireAuth><><ChatInterview/></></RequireAuth>
    },
    {
      path: "/video-interview",
      element: <RequireAuth><><VideoInterview/></></RequireAuth>
    },
    {
      path: "/voice-interview",
      element: <RequireAuth><><VoiceInterview/></></RequireAuth>
    },
    {
      path: "/questions/:topic",
      element: <RequireAuth><><Header/><Questions/><Footer/></></RequireAuth>
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