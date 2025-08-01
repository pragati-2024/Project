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
      path: "/interviewsetup",
      element: <><Header/><InterviewSetup/><Footer/></>
    },
    {
      path: "/chat-interview",
      element: <><ChatInterview/></>
    }
  ])
    return (
      <><RouterProvider router={router} /></>
    )
}

export default App;