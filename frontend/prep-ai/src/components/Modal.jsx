import React from 'react'

function Modal({isOpen, onClose, children,title, hideHeader}) {
  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full">
      {/* modal content */}
      <div className='relative flex flex-col bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300'>
        {/* modal Header */}
          {!hideHeader && (
            <div className='flex items-center justify-between border-b border-gray-200 p-3'>
              <h3 className='md:text-lg font-medium text-gray-900'>{title}</h3>
            </div>
          )}
       <button
       type="button"
       className='hover:bg-orange-100 hover:text-gray-700 rounded-lg text-sm w-7 h-7
text-gray-400 bg-transparent flex justify-center items-center absolute top-3.5 right-3.5 cursor-pointer'
       onClick={onClose}
       >
     <svg 
     className='w-4 h-4'
     aria-hidden="true"
     xmlns="http://www.w3.org/2000/svg"
     fill="none"
     viewBox="0 0 14 14">

     <path
stroke="currentColor"
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth="2"
d="M1 1l12 12M13 1L1 13"/>
</svg></button>

<div className='flex-1 overflow-y-auto custom-scrollbar'>
  {children}
</div>
      </div>
    </div>
  )
}

export default Modal;

