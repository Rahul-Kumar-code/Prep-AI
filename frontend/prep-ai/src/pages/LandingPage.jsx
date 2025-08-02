import React, { useContext, useState } from "react";
import Hero_Img from "../assets/hero-img.png";
import APP_FEATURES from "../utils/data";
import { useNavigate } from "react-router-dom";
import {LuSparkles} from 'react-icons/lu';
import Modal from "../components/Modal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";

function LandingPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if(!user){
      setOpenAuthModel(true);
    }else{
      navigate('/dashboard');
    }

  };
  return (
    <>
   <div className="w-full min-h-full bg-[#0F172A] px-5 relative overflow-hidden text-gray-100">
  <div className="w-[500px] h-[500px] bg-cyan-400/10 blur-[80px] absolute top-0 left-0" />
  <div className="container mx-auto px-4 pt-6 pb-[200px] relative z-10">
    {/* Header */}
    <header className="flex justify-between items-center mb-16">
      <div className="text-xl font-bold tracking-wide text-white">PREP AI</div>
      {user ? (
        <ProfileInfoCard />
      ) : (
       <button
  onClick={() => setOpenAuthModel(true)}
  className="relative inline-block px-7 py-2.5 rounded-full text-sm font-semibold text-white 
             bg-transparent border border-white cursor-pointer overflow-hidden 
             transition-all duration-300 group"
>
  <span className="relative z-10">Login / Sign Up</span>

  {/* Left to right background fill on hover */}
  <span className="absolute inset-0 bg-gradient-to-r from-rose-400 to-indigo-500 
                   scale-x-0 origin-left rounded-full transition-transform duration-300 
                   group-hover:scale-x-100 z-0" />
</button>

      )}
    </header>

    {/* Hero Content */}
    <div className="flex flex-col md:flex-row items-center">
      <div className="w-full md:w-1/2 pr-4 mb-8">
        <div className="flex items-center justify-left mb-2">
          <div className="flex items-center gap-2 text-[13px] text-sky-300 font-semibold bg-sky-900/10 px-3 py-1 rounded-full border border-sky-500">
            <LuSparkles /> AI POWERED
          </div>
        </div>

        <h1 className="text-5xl text-white font-semibold mb-6 leading-tight">
          AI Interviews with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-[length:200%_200%] animate-text-shine font-bold">
            AI-Powered
          </span>{" "}
          Learning
        </h1>
      </div>

      <div className="w-full md:w-1/2">
        <p className="text-[17px] text-slate-200 mr-0 md:mr-20 mb-6">
          Get role-specific questions, expand answers when you need them,
          dive deeper into concepts, and organize everything your way.
          From preparation to mastery - your ultimate interview toolkit is here.
        </p>
       <button
  className="relative px-7 py-2.5 rounded-full text-sm font-semibold text-white 
             bg-gradient-to-r from-emerald-500 to-sky-500 
             shadow-md transition-all duration-300 ease-in-out 
             before:absolute before:inset-0 before:rounded-full 
             before:border-2 before:border-white before:opacity-0 
             before:scale-75 before:transition-transform before:duration-300 
             hover:before:opacity-100 hover:before:scale-100 
             hover:shadow-[0_0_15px_rgba(255,255,0,0.4)] 
             hover:animate-pulse-glow overflow-hidden z-0 cursor-pointer"
  onClick={handleCTA}
>
  <span className="relative z-10">Get Started</span>
</button>

      </div>
    </div>
  </div>
</div>

{/* Hero Image */}
<div className="w-full min-h-full relative z-10">
  <section className="flex items-center justify-center -mt-36">
    <img src={Hero_Img} alt="Hero" className="w-[80vw] rounded-lg shadow-2xl" />
  </section>
</div>

{/* Features Section */}
<div className="w-full min-h-full bg-gradient-to-br from-[#111827] via-[#1E293B] to-[#0F172A] mt-10">
  <div className="container mx-auto px-4 pt-10 pb-20">
    <section className="mt-5">
      <h2 className="text-3xl font-bold text-center mb-12 text-white drop-shadow-sm">
        ✨ Features That Make You Shine
      </h2>

      <div className="flex flex-col items-center gap-10">
        {/* Top 3 features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {APP_FEATURES.slice(0, 3).map((feature) => (
            <div
              key={feature.id}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-md shadow-md hover:shadow-xl border border-cyan-400/30 hover:border-sky-500 transition hover:scale-[1.02]"
            >
              <h3 className="text-lg font-semibold mb-3 text-sky-400">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Remaining features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {APP_FEATURES.slice(3).map((feature) => (
            <div
              key={feature.id}
              className="bg-white/5 p-6 rounded-xl backdrop-blur-md shadow-md hover:shadow-xl border border-emerald-400/30 hover:border-emerald-500 transition hover:scale-[1.02]"
            >
              <h3 className="text-lg font-semibold mb-3 text-emerald-400">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
</div>

{/* Footer */}
<div className="text-sm bg-slate-900 text-slate-300 text-center p-5">
  Made with 💜 by PREP AI
</div>

{/* Modal */}
<Modal
  isOpen={openAuthModel}
  onClose={() => {
    setOpenAuthModel(false);
    setCurrentPage("login");
  }}
  hideHeader
>
  <div>
    {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
    {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
  </div>
</Modal>
    </>
  );
}

export default LandingPage;
