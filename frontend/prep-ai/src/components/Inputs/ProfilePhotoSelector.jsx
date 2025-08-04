import { useRef } from 'react';
import React, { useState } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

function ProfilePhotoSelector({image, setImage, preview, setPreview}) {

  const inputRef = useRef(null);
  const [previewUrl,setPreviewUrl] = useState("");

  const handleImageChange = (e) =>{
    const file = e.target.files[0];
    if(file){
       setImage(file);

     const preview = URL.createObjectURL(file);
     if(setPreview){
      setPreview(preview);
    }
    setPreviewUrl(preview);
  }
  }
  const handleRemoveImage=()=>{
    setImage(null);
    setPreviewUrl(null);

    if(setPreview) setPreview(null);
  }

  const onChooseFile = ()=>{
    inputRef.current.click();
  }

  return (
    <div className='flex justify-center mb-5'>
      <input
      type="file"
      accept="image/*"
      ref={inputRef}
      onChange={handleImageChange}
      className='hidden'
      />

      {!image? (<div className='w-21 h-21 flex justify-center items-center bg-sky-100 rounded-full relative cursor-pointer'>
        <LuUser className='text-4xl text-indigo-500'/>
        <button
        type="button"
        className='w-9 h-9 flex items-center justify-center absolute bg-linear-to-r from-indigo-500/85 to-indigo-600 text-white rounded-full -bottom-1 -right-1 cursor-pointer'
        onClick={onChooseFile}
        >
        <LuUpload/>
        </button>
      </div>):(<div className='relative'>
        <img
        src={preview || previewUrl}
        alt="profile photo"
        className='w-21 h-21 rounded-full object-cover border-2 border-orange-200'
        />
        <button
        type="button"
        onClick={handleRemoveImage}
        className='w-9 h-9 bg-rose-500 flex items-center justify-center text-white rounded-full absolute -bottom-2 -right-2 cursor-pointer'
        >
          <LuTrash/>
        </button>
      </div>)}
    </div>
  )
}

export default ProfilePhotoSelector;

