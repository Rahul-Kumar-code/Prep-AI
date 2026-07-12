import React from 'react';

function RoleInfoHeader({
    role,
    topicsToFocus,
    experience,
    questions,
    lastUpdated
  }){
  return (
  <div className="bg-gradient-to-r from-sky-400 to-purple-500 relative p-4">
    <div className="container mx-auto md:px-12">
      <div className="h-[120px] flex flex-col justify-center relative z-10">
        <div className="flex items-start">
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-medium">{role}</h2>
                <p className="text-sm font-medium text-gray-800 mt-1">
                  {topicsToFocus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <div className="text-[12px] font-semibold text-black bg-white px-3 py-2 rounded-full ">
          Experience: {experience} {experience == 1 ? "Year" : "Years"}
        </div>

        <div className="text-[12px] font-semibold text-black bg-white  px-3 py-2 rounded-full">
          {questions} Q&A
        </div>

        <div className="text-[12px] font-semibold text-black bg-white  px-3 py-2 rounded-full">
          Last Updated: {lastUpdated}
        </div>
      </div>
    </div>
  </div>
);
}

export default RoleInfoHeader;