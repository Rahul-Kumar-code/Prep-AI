import React from "react";
import { LuTrash2 } from "react-icons/lu";
import { getInitials } from '../../utils/helper';
import { color } from "framer-motion";
function SummaryCard({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) {
  return (
    <div className="bg-white border-[2px]
    border-[#385798]   rounded-xl p-2 overflow-hidden cursor-pointer hover:shadow-xl
relative group" 
    onClick={onSelect}
  >
      <div
        className="rounded-lg p-4 cursor-pointer relative"
        style={{
          background: colors.bgcolor,
        }}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12
bg-white rounded-md flex items-center justify-center mr-4">
            <span className="text-lg font-semibold text-indigo-700">
              {getInitials(role)}
            </span>
          </div>

          {/* Content Container */}
          <div className="flex-grow">
            <div className="flex items-start justify-between ">
              {/* Title and Skills */}
              <div>
                <h2 className="text-[17px] font-medium text-black">{role}</h2>
                <p className="text-sm font-medium text-gray-900">{topicsToFocus}</p>
              </div>
            </div>
          </div>
        </div>
        <button
        className="hidden group-hover:flex items-center gap-2 text-xs text-rose-500 font-medium bg-rose-200 px-3 py-2 rounded text-nowrap border border-rose-200 hover:border-rose-200 absolute top-0 right-0 cursor-pointer"
        onClick={(e)=>{
          e.stopPropagation();
          onDelete();
        }}>
          <LuTrash2/>
        </button>
      </div>
      <div className="px-3 pb-3">
        <div className="flex items-center mt-4 gap-3">
          <div className="text-[12px] font-medium text-black px-3 py-1 border-1 [0.5px] border-gray-400 bg-gray-200 rounded-full">
          Experience:  {experience} {experience === 1 ? "year" : "years"}
          </div>
          <div className="text-[12px] font-medium text-black px-3 py-1 border-1 [0.5px] border-gray-400 rounded-full bg-gray-200">
          {questions} Q&A
          </div>
          <div className="text-[12px] font-medium text-black px-3 py-1 border-1 [0.5px] border-gray-400 rounded-full bg-gray-200">
          Last Updated: {lastUpdated} Q&A
          </div>
        </div>
        <p className="text-[13px] font-medium mt-3 py-1 text-gray-500 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}

export default SummaryCard;
