import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChannelSelectionModal = ({ isOpen, channels, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChannelSelect = (channelId) => {
    navigate(`/editor/dashboard/${channelId}`);
    onClose(); // Close the modal after selection
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-90 flex justify-center items-center">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-white">Select a Channel</h2>
        <div className="flex flex-row flex-wrap justify-start items-center">
          {channels.map(channel => (
            <button
              key={channel.channelId}
              onClick={() => handleChannelSelect(channel.channelId)}
              className="text-white hover:text-gray-300 bg-indigo-600 rounded-lg px-4 py-2 mr-2"
            >
              {channel.channelName}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChannelSelectionModal;