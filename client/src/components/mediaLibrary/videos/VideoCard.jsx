import React from 'react';
import { format } from 'date-fns';
import { FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const { coverImage, title, description, createdAt, _id } = video;

  return (
    <div className="bg-[var(--primary)] rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Video Cover Section */}
      <div className="relative m-3 overflow-hidden rounded-lg">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-40 md:h-48 object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
        />
        {/* Play Button */}
        <Link
          to={`/all-videos/video/${_id}`}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg hover:bg-opacity-75 transition-opacity duration-300"
        >
          <FaPlay className="text-white text-5xl" />
        </Link>
      </div>

      {/* Video Details Section */}
      <div className="p-4 space-y-2">
        <Link to={`/all-videos/video/${_id}`} className="block">
          <h3 className="text-lg font-bold line-clamp-2 text-white hover:text-blue-600 transition-colors duration-300">
            {title}
          </h3>
        </Link>
        <p className="text-[var(--grey--600)] text-sm line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-2 text-[var(--grey--700)] text-xs">
          <p>Created on: {format(new Date(createdAt), 'MMM dd, yyyy')}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;