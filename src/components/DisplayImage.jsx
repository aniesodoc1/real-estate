import React from 'react'

const DisplayImage = ({ imgUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-auto rounded-xl shadow-lg bg-gray-900">
        <button
          className="absolute top-2 right-2 text-white text-xl font-bold z-10 bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center"
          onClick={onClose}
        >
          ×
        </button>
        <img
          src={imgUrl}
          alt="Full view"
          className="w-full h-auto object-contain rounded"
        />
      </div>
    </div>
  )
}

export default DisplayImage
