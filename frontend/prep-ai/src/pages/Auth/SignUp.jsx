import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import uploadImage from "../../utils/uploadImage";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

function App({ setCurrentPage }) {
  const [profilePic, setProfilePic] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";
    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setIsLoading(true);
    //SignUp API Call
    try {
      if (profilePic) {
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });

      toast.success("user registered successfully");
      setCurrentPage("login");
    } catch (error) {
      console.error("Sign Up error:", error); // Debug log
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-xl font-semibold text-black">Create an account</h3>
      <p className="text-md text-slate-700 mt-[5px] mb-6">
        Join us today by entering your details below.
      </p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label="Full Name"
          placeholder="John Wick"
          type="text"
        />
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
        >
          {isLoading && <SpinnerLoader />} {!isLoading && <span>Sign Up</span>}
        </button>

        <p className="text-[17px] text-slate-800 mt-4">
          Already have an account?{" "}
          <button
            className="font-medium text-indigo-500 hover:text-indigo-300 underline cursor-pointer"
            onClick={() => setCurrentPage("login")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default App;
