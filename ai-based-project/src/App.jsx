import React from 'react';
import Home from "./Pages/Home.jsx";
import InterviewTips from "./components/InterviewTips.jsx";
import Header from "./components/header.jsx";
import Footer from "./components/Footer.jsx";
import Login from './components/Login.jsx';
import ContactUs from './components/ContactUs.jsx';
import Eror404 from './components/Eror404.jsx'; 

import "./App.css";

function App() {
  return (
    <div>
      <Header />
      <Home />
      <Footer />
      <InterviewTips />
      <Login />
      <ContactUs />
      <Eror404 />
    </div>
  );
}

export default App;