import React from 'react';
import { createPortal } from 'react-dom';
import { 
    FaGem, FaPalette, FaTimes, FaUnlock, FaLock, FaLayerGroup,
    FaCheck,
    FaCrown
} from "react-icons/fa";

const AvatarCustomizerModal = ({ show, onClose, user, selectedFrame, setSelectedFrame, selectedAccessories, toggleAccessory, handleSaveAvatarCustomization, avatarFrames, avatarAccessories, communityTitles }) => {
  if (!show) return null;

  const modalContent = (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl transform transition-all relative z-50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        <div className="px-6 sm:px-8 py-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--grey--900)] flex items-center justify-center">
              <FaPalette className="mr-2 text-[var(--primary)]" /> Customize Your Avatar
            </h3>
            <p className="text-[var(--grey--800)] mt-2">
              Personalize your avatar with frames and accessories
            </p>
          </div>

          <div className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Anonymous")}`}
                  alt="Avatar Preview"
                  className={`w-24 h-24 rounded-full object-cover ${avatarFrames.find(f => f.id === selectedFrame)?.color || 'ring-gray-200'} ring-4`}
                />
                {selectedAccessories.map(accId => {
                  const accessory = avatarAccessories.find(a => a.id === accId);
                  if (!accessory) return null;
                  return (
                    <div key={accId} className={`absolute ${accessory.position} w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm`}>
                      {accessory.icon}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Frame Selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaLayerGroup className=" text-[var(--primary)] mr-2" /> Avatar Frames
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {avatarFrames.map(frame => {
                  const isUnlocked = user?.currentPoints >= frame.minPoints;
                  const isSelected = selectedFrame === frame.id;
                  return (
                    <button
                      key={frame.id}
                      onClick={() => isUnlocked && setSelectedFrame(frame.id)}
                      disabled={!isUnlocked}
                      className={`p-2 rounded-lg flex flex-col items-center ${
                        isSelected ? 'bg-blue-100 border-2 border-blue-400' : 
                        isUnlocked ? 'bg-white border border-gray-200 hover:bg-gray-50' : 
                        'bg-gray-100 border border-gray-200 opacity-60'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full ${frame.color} flex items-center justify-center mb-1`}>
                        {frame.icon}
                      </div>
                      <span className="text-xs font-medium">{frame.name}</span>
                      {!isUnlocked && (
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <FaLock className="mr-1 text-gray-400" size={10} />
                          {frame.minPoints}pts
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accessory Selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaCrown className="text-purple-500 mr-2" /> Avatar Accessories
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {avatarAccessories.map(accessory => {
                  const isUnlocked = user?.currentPoints >= accessory.minPoints;
                  const isSelected = selectedAccessories.includes(accessory.id);
                  return (
                    <button
                      key={accessory.id}
                      onClick={() => isUnlocked && toggleAccessory(accessory.id)}
                      disabled={!isUnlocked}
                      className={`p-2 rounded-lg flex items-center gap-2 ${
                        isSelected ? 'bg-blue-100 border-2 border-blue-400' : 
                        isUnlocked ? 'bg-white border border-gray-200 hover:bg-gray-50' : 
                        'bg-gray-100 border border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                        {accessory.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-xs font-medium">{accessory.name}</div>
                        {!isUnlocked ? (
                          <div className="text-xs text-gray-500 flex items-center">
                            <FaLock className="mr-1 text-gray-400" size={10} />
                            {accessory.minPoints}pts
                          </div>
                        ) : (
                          <div className="text-xs text-green-500 flex items-center">
                            <FaUnlock className="mr-1" size={10} />
                            Unlocked
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                onClick={onClose}
                className="btn-red  transition-colors flex items-center gap-2"
              >
                <FaTimes className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSaveAvatarCustomization}
                className="btn-2 transition-colors flex items-center gap-2"
              >
                <FaCheck className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AvatarCustomizerModal;