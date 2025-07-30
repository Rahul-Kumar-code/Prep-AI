import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Home/Dashboard';
import InterviewPrep from './pages/InterviewPrep/InterviewPrep';
import UserProvider from './context/userContext';

function App() {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          {/* Default page */}
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/interview-prep/:sessionId" element={<InterviewPrep/>}/>
        </Routes>
      </Router>

      <Toaster
      toastOptions={{
        className : "",
        style : {
        fontSize : "14px",
        },
      }}/>
    </div>
</UserProvider>
  )
}

export default App;

