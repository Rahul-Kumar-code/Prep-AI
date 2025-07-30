import React from 'react';

const DeleteAlertContent = ({ content, onDelete }) => {
  return (
    <div className="p-6">
      <p className="text-[15px]">{content}</p>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="bg-rose-600 py-2 px-3 rounded-lg text-white cursor-pointer hover:bg-rose-400"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlertContent;
