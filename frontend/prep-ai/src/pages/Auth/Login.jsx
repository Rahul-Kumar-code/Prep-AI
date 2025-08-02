import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

function Login({ setCurrentPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fixed: Use useContext instead of createContext
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("please enter the password");
      return;
    }
        setIsLoading(true)
    // Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log("Login response:", response.data); // Debug log

      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError("Login failed: No token received");
      }
    } catch (error) {
      toast.error("Failed to login!");
      if (error.response && error.response.data.message){
            setError(error.response.data.message);
      }
      else {setError("Something went wrong, Please try again.");}
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
      <p className="text-md text-slate-700 mt-[5px] mb-6">
        Please enter your details to log in
      </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="text"
        />

        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 Characters"
          type="password"
        />
        {error && <p className="text-red-500 text-[15px] pt-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-black text-white p-2 mt-5 cursor-pointer rounded-md hover:bg-indigo-500"
          disabled={isLoading}
        >
           {isLoading && <SpinnerLoader />} {!isLoading && <span>LOGIN</span>}
        </button>

        <p className="text-[17px] text-slate-800 mt-4">
          Don't have an account?{" "}
          <button
            type="button"
            className="font-medium text-indigo-500 hover:text-indigo-300 underline cursor-pointer"
            onClick={() => setCurrentPage("signup")}
          >
            SignUp
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;