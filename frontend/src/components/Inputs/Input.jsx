import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

function Input({ value, onChange, label, placeholder, type }) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword=()=>{
     setShowPassword(!showPassword);
  }
  return(
    <div className="mt-3">
       <label className="text-[17px] text-slate-800 mt-5">{label}</label>
    <div className="flex mt-1 border-2 border-transparent p-2 hover:border-indigo-300 rounded-lg bg-slate-100">
            <input
        value={value}
        onChange={(e) => onChange(e)}
        label={label}
        className="w-full bg-transparent outline-none text-blue-600 placeholder:text-slate-400"
        placeholder={placeholder}
        type={
          type === "password" ? (showPassword ? "text" : "password") : type
        }
      />
      {type === "password" && (
        <>
        {showPassword?(
          <FaRegEye
           className="text-indigo-500 cursor-pointer"
           size={18}
           onClick={()=>toggleShowPassword()}
          />
        ):(
      <FaRegEyeSlash
           className="cursor-pointer text-slate-400"
           size={18}
           onClick={()=>toggleShowPassword()}
          />
        )}
        </>
      )}
    </div>
    
    </div>)
}

export default Input;
